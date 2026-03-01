/**
 * ClickPesa Payment Gateway API integration
 * Docs: https://docs.clickpesa.com/
 */

const CLICKPESA_BASE_URL =
  process.env.CLICKPESA_BASE_URL || "https://api.clickpesa.com/third-parties";
const CLICKPESA_API_KEY = process.env.CLICKPESA_API_KEY || "";
const CLICKPESA_CLIENT_ID = process.env.CLICKPESA_CLIENT_ID || "";
const CLICKPESA_SECRET_KEY = process.env.CLICKPESA_SECRET_KEY || "";

let cachedToken: { token: string; expiresAt: number } | null = null;
const TOKEN_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before expiry (tokens valid 1 hour)

export interface ClickPesaCheckoutRequest {
  totalPrice: string;
  orderReference: string;
  orderCurrency: "TZS" | "USD";
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
}

export interface ClickPesaCheckoutResponse {
  checkoutLink: string;
  clientId: string;
}

export interface ClickPesaPaymentStatusItem {
  id: string;
  status: "SUCCESS" | "SETTLED" | "PROCESSING" | "PENDING" | "FAILED";
  paymentReference?: string;
  orderReference: string;
  collectedAmount?: number;
  collectedCurrency?: string;
  message?: string;
  channel?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface ClickPesaWebhookPayload {
  event: "PAYMENT RECEIVED" | "PAYMENT FAILED" | string;
  data: {
    id?: string;
    status: string;
    orderReference?: string;
    paymentReference?: string;
    collectedAmount?: string | number;
    collectedCurrency?: string;
    message?: string;
    channel?: string;
    updatedAt?: string;
    createdAt?: string;
  };
  checksum?: string;
  checksumMethod?: string;
}

function ensureCredentials(): void {
  if (!CLICKPESA_API_KEY || !CLICKPESA_CLIENT_ID) {
    throw new Error(
      "ClickPesa credentials missing. Set CLICKPESA_API_KEY and CLICKPESA_CLIENT_ID."
    );
  }
}

/**
 * Generate JWT token for ClickPesa API (cached, valid 1 hour)
 */
export async function getClickPesaToken(): Promise<string> {
  ensureCredentials();
  if (cachedToken && Date.now() < cachedToken.expiresAt - TOKEN_BUFFER_MS) {
    return cachedToken.token;
  }

  const response = await fetch(`${CLICKPESA_BASE_URL}/generate-token`, {
    method: "POST",
    headers: {
      "api-key": CLICKPESA_API_KEY,
      "client-id": CLICKPESA_CLIENT_ID,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("ClickPesa token error:", response.status, text);
    throw new Error("ClickPesa authentication failed. Check API key and client ID.");
  }

  const data = (await response.json()) as { success?: boolean; token?: string };
  if (!data.success || !data.token) {
    throw new Error("Invalid token response from ClickPesa");
  }

  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
  return data.token;
}

/**
 * Canonicalize payload for checksum (recursive key sort)
 */
function canonicalize(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  return Object.keys(obj as Record<string, unknown>)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = canonicalize((obj as Record<string, unknown>)[key]);
        return acc;
      },
      {} as Record<string, unknown>
    );
}

/**
 * Create HMAC-SHA256 checksum for payload (optional, when enabled in ClickPesa dashboard)
 */
export function createPayloadChecksum(payload: Record<string, unknown>): string {
  if (!CLICKPESA_SECRET_KEY) return "";
  const crypto = require("crypto");
  const canonical = canonicalize(payload);
  const payloadString = JSON.stringify(canonical);
  const hmac = crypto.createHmac("sha256", CLICKPESA_SECRET_KEY);
  hmac.update(payloadString);
  return hmac.digest("hex");
}

/**
 * Validate webhook checksum (optional)
 */
export function validateWebhookChecksum(
  payload: Record<string, unknown>,
  receivedChecksum: string
): boolean {
  if (!CLICKPESA_SECRET_KEY || !receivedChecksum) return false;
  const { checksum, checksumMethod, ...rest } = payload;
  const computed = createPayloadChecksum(rest as Record<string, unknown>);
  return computed === receivedChecksum;
}

/**
 * Generate checkout link (hosted payment page). Customer is redirected to ClickPesa to pay.
 */
export async function generateCheckoutUrl(
  request: ClickPesaCheckoutRequest
): Promise<ClickPesaCheckoutResponse> {
  const token = await getClickPesaToken();

  const body: Record<string, string> = {
    totalPrice: request.totalPrice,
    orderReference: request.orderReference,
    orderCurrency: request.orderCurrency,
    customerName: request.customerName || "",
    customerEmail: request.customerEmail || "",
    customerPhone: request.customerPhone || "",
    description: request.description || "",
  };

  if (CLICKPESA_SECRET_KEY) {
    body.checksum = createPayloadChecksum(body);
  }

  const response = await fetch(
    `${CLICKPESA_BASE_URL}/checkout-link/generate-checkout-url`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = (await response.json()) as
    | { checkoutLink?: string; clientId?: string }
    | { error?: string; message?: string };

  if (!response.ok) {
    const err = data as { error?: string; message?: string };
    console.error("ClickPesa checkout error:", response.status, data);
    throw new Error(
      err.message || err.error || "Failed to generate ClickPesa checkout link"
    );
  }

  const res = data as { checkoutLink?: string; clientId?: string };
  if (!res.checkoutLink) {
    throw new Error("No checkout link in ClickPesa response");
  }

  return {
    checkoutLink: res.checkoutLink,
    clientId: res.clientId || "",
  };
}

/**
 * Query payment status by order reference (our order.id)
 */
export async function queryPaymentStatus(
  orderReference: string
): Promise<ClickPesaPaymentStatusItem[]> {
  const token = await getClickPesaToken();

  const response = await fetch(
    `${CLICKPESA_BASE_URL}/payments/${encodeURIComponent(orderReference)}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const text = await response.text();
    console.error("ClickPesa query error:", response.status, text);
    throw new Error("Failed to query ClickPesa payment status");
  }

  const data = (await response.json()) as ClickPesaPaymentStatusItem[];
  return Array.isArray(data) ? data : [];
}
