import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_IMAGES = 3;
const MAX_IMAGE_LENGTH = 2_000_000; // ~2MB per image (base64) to avoid huge rows

export async function GET() {
  try {
    const list = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
    const items = list.map((f) => ({
      id: f.id,
      name: f.user.name || f.user.email?.split("@")[0] || "Customer",
      comment: f.comment,
      images: f.images,
      createdAt: f.createdAt.toISOString(),
    }));
    return NextResponse.json(items);
  } catch (err) {
    console.error("Feedback GET error:", err);
    return NextResponse.json(
      { error: "Failed to load feedback." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to submit feedback." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    let images: string[] = [];
    if (Array.isArray(body.images)) {
      images = body.images
        .filter((s): s is string => typeof s === "string")
        .slice(0, MAX_IMAGES)
        .filter((s) => s.length <= MAX_IMAGE_LENGTH);
    }

    if (comment.length < 3) {
      return NextResponse.json(
        { error: "Please write a longer comment (at least 3 characters)." },
        { status: 400 }
      );
    }

    await prisma.feedback.create({
      data: {
        userId: session.user.id,
        comment,
        images,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback POST error:", err);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
