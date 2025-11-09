import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PaymentMethod from "@/models/PaymentMethod";
import { getCurrentUser } from "@/lib/auth";

// GET - Obtener un método de pago por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await Promise.resolve(params);

    const paymentMethod = await PaymentMethod.findOne({
      _id: id,
      userId: currentUser.userId,
    }).lean();

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: paymentMethod._id.toString(),
      name: paymentMethod.name,
      icon: paymentMethod.icon,
      createdAt: paymentMethod.createdAt.toISOString(),
      updatedAt: paymentMethod.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching payment method:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment method", message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un método de pago
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await Promise.resolve(params);

    // Verificar que el método de pago pertenece al usuario
    const existingPaymentMethod = await PaymentMethod.findOne({
      _id: id,
      userId: currentUser.userId,
    }).lean();
    
    if (!existingPaymentMethod) {
      return NextResponse.json(
        { error: "Không tìm thấy phương thức thanh toán hoặc bạn không có quyền chỉnh sửa" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.icon !== undefined) updateData.icon = body.icon;

    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId: currentUser.userId },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: paymentMethod._id.toString(),
      name: paymentMethod.name,
      icon: paymentMethod.icon,
      createdAt: paymentMethod.createdAt.toISOString(),
      updatedAt: paymentMethod.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Failed to update payment method", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un método de pago
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await Promise.resolve(params);

    // Verificar que el método de pago pertenece al usuario
    const existingPaymentMethod = await PaymentMethod.findOne({
      _id: id,
      userId: currentUser.userId,
    }).lean();
    
    if (!existingPaymentMethod) {
      return NextResponse.json(
        { error: "Không tìm thấy phương thức thanh toán hoặc bạn không có quyền xóa" },
        { status: 404 }
      );
    }

    const paymentMethod = await PaymentMethod.findOneAndDelete({
      _id: id,
      userId: currentUser.userId,
    });

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Failed to delete payment method", message: error.message },
      { status: 500 }
    );
  }
}
