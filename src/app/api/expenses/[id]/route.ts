import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { ExpenseFormData } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";

// GET - Obtener un gasto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const expense = await Expense.findOne({
      _id: params.id,
      userId: currentUser.userId,
    }).lean();

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: expense._id.toString(),
      amount: expense.amount,
      description: expense.description,
      categoryId: expense.categoryId,
      paymentMethodId: expense.paymentMethodId,
      date: expense.date.toISOString(),
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense", message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un gasto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body: Partial<ExpenseFormData> = await request.json();

    const updateData: any = {};
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.paymentMethodId !== undefined)
      updateData.paymentMethodId = body.paymentMethodId;
    if (body.date !== undefined) updateData.date = new Date(body.date);

    const expense = await Expense.findOneAndUpdate(
      { _id: params.id, userId: currentUser.userId },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: expense._id.toString(),
      amount: expense.amount,
      description: expense.description,
      categoryId: expense.categoryId,
      paymentMethodId: expense.paymentMethodId,
      date: expense.date.toISOString(),
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un gasto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const expense = await Expense.findOneAndDelete({
      _id: params.id,
      userId: currentUser.userId,
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense", message: error.message },
      { status: 500 }
    );
  }
}
