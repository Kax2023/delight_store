import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { queryPaymentStatus } from "@/lib/clickpesa";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Logged-in: must own the order. Guest: order must have no userId.
    if (payment.order.userId) {
      if (!session?.user?.id || payment.order.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }
    }

    try {
      const statusList = await queryPaymentStatus(orderId);

      if (statusList.length > 0) {
        const latest = statusList[0];
        const clickpesaStatus = latest.status;

        let newStatus = payment.status;
        if (
          clickpesaStatus === "SUCCESS" ||
          clickpesaStatus === "SETTLED"
        ) {
          newStatus = "COMPLETED";
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "PROCESSING" },
          });
        } else if (clickpesaStatus === "FAILED") {
          newStatus = "FAILED";
        } else if (
          clickpesaStatus === "PROCESSING" ||
          clickpesaStatus === "PENDING"
        ) {
          newStatus = "PROCESSING";
        }

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: newStatus,
            clickpesaTransactionId:
              latest.paymentReference ?? payment.clickpesaTransactionId,
            paymentMethod: latest.channel ?? payment.paymentMethod,
          },
        });

        return NextResponse.json(
          {
            status: newStatus,
            transactionId: latest.paymentReference,
            paymentMethod: latest.channel,
          },
          { status: 200 }
        );
      }
    } catch (err) {
      console.error("Error checking ClickPesa status:", err);
    }

    return NextResponse.json(
      {
        status: payment.status,
        transactionId: payment.clickpesaTransactionId,
        paymentMethod: payment.paymentMethod,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to verify payment";
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
