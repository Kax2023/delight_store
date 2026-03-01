import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCheckoutUrl } from "@/lib/clickpesa";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId && order.userId !== session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (!order.userId && !order.guestEmail) {
      return NextResponse.json(
        { error: "Invalid guest order" },
        { status: 400 }
      );
    }

    // Idempotency: avoid unique constraint races on `orderId` (e.g. double-click / React dev double-effect)
    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        // Keep amount in sync in case order total changes before payment
        amount: order.total,
      },
      create: {
        orderId: order.id,
        amount: order.total,
        status: "PENDING",
        paymentMethod: "clickpesa",
      },
    });

    const buyerEmail = order.user?.email || order.guestEmail || "";
    const buyerName = order.user?.name || order.guestName || "";

    const checkoutResponse = await generateCheckoutUrl({
      totalPrice: String(Math.round(order.total)),
      orderReference: order.id,
      orderCurrency: "TZS",
      customerName: buyerName || undefined,
      customerEmail: buyerEmail || undefined,
      customerPhone: order.phoneNumber || undefined,
      description: `Order ${order.id.slice(0, 8).toUpperCase()}`,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        clickpesaOrderId: order.id,
        status: "PROCESSING",
        paymentMethod: "clickpesa",
      },
    });

    return NextResponse.json(
      {
        checkoutUrl: checkoutResponse.checkoutLink,
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to initiate payment";
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
