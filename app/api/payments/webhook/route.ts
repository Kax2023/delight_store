import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  validateWebhookChecksum,
  type ClickPesaWebhookPayload,
} from "@/lib/clickpesa";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClickPesaWebhookPayload;
    const headers = request.headers;

    const receivedChecksum = body.checksum ?? headers.get("x-checksum") ?? "";
    if (
      process.env.CLICKPESA_SECRET_KEY &&
      receivedChecksum &&
      !validateWebhookChecksum(body as unknown as Record<string, unknown>, receivedChecksum)
    ) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const event = body.event;
    const data = body.data;

    if (!data?.orderReference) {
      return NextResponse.json(
        { error: "Order reference is required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findFirst({
      where: { orderId: data.orderReference },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    let paymentStatus = payment.status;

    if (event === "PAYMENT RECEIVED") {
      if (
        data.status === "SUCCESS" ||
        data.status === "SETTLED"
      ) {
        paymentStatus = "COMPLETED";
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "PROCESSING" },
        });
      } else if (
        data.status === "PROCESSING" ||
        data.status === "PENDING"
      ) {
        paymentStatus = "PROCESSING";
      }
    } else if (event === "PAYMENT FAILED") {
      paymentStatus = "FAILED";
    } else {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus,
        clickpesaTransactionId:
          data.paymentReference ?? payment.clickpesaTransactionId,
        paymentMethod: data.channel ?? payment.paymentMethod,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
