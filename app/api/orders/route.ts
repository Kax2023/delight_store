import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
    })
  ),
  shippingAddress: z.string().min(1),
  phoneNumber: z.string().min(1),
  region: z.string().min(1),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Check if this is a guest order
    const isGuestOrder = !session?.user?.id && validatedData.guestEmail;

    if (!session?.user?.id && !isGuestOrder) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in or provide guest information." },
        { status: 401 }
      );
    }

    // Validate guest order requirements
    if (isGuestOrder && (!validatedData.guestEmail || !validatedData.guestName)) {
      return NextResponse.json(
        { error: "Guest email and name are required for guest checkout" },
        { status: 400 }
      );
    }

    // Calculate total
    const total = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        guestEmail: isGuestOrder ? validatedData.guestEmail : null,
        guestName: isGuestOrder ? validatedData.guestName : null,
        total,
        shippingAddress: validatedData.shippingAddress,
        phoneNumber: validatedData.phoneNumber,
        region: validatedData.region,
        status: "PENDING",
        orderItems: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
