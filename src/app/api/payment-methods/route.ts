import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PaymentMethod from "@/models/PaymentMethod";
import { getCurrentUser } from "@/lib/auth";

// GET - Obtener todos los métodos de pago
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Obtener solo los métodos de pago del usuario con proyección optimizada
    const paymentMethods = await PaymentMethod.find({
      userId: currentUser.userId,
    })
      .select("name icon createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    const formattedPaymentMethods = paymentMethods.map((pm) => ({
      id: pm._id.toString(),
      name: pm.name,
      icon: pm.icon,
      createdAt: pm.createdAt.toISOString(),
      updatedAt: pm.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedPaymentMethods);
  } catch (error: any) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods", message: error.message },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo método de pago
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    const paymentMethod = new PaymentMethod({
      userId: currentUser.userId,
      name: body.name,
      icon: body.icon,
    });

    const savedPaymentMethod = await paymentMethod.save();

    return NextResponse.json({
      id: (savedPaymentMethod._id as any).toString(),
      name: savedPaymentMethod.name,
      icon: savedPaymentMethod.icon,
      createdAt: savedPaymentMethod.createdAt.toISOString(),
      updatedAt: savedPaymentMethod.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating payment method:", error);
    return NextResponse.json(
      { error: "Failed to create payment method", message: error.message },
      { status: 500 }
    );
  }
}
