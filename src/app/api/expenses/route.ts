import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { ExpenseFormData, ExpenseFilters } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";

// GET - Obtener todos los gastos o filtrar
export async function GET(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const filters: ExpenseFilters = {};

    if (searchParams.get("startDate")) {
      filters.startDate = searchParams.get("startDate")!;
    }
    if (searchParams.get("endDate")) {
      filters.endDate = searchParams.get("endDate")!;
    }
    if (searchParams.get("categoryId")) {
      filters.categoryId = searchParams.get("categoryId")!;
    }
    if (searchParams.get("paymentMethodId")) {
      filters.paymentMethodId = searchParams.get("paymentMethodId")!;
    }
    if (searchParams.get("minAmount")) {
      filters.minAmount = Number(searchParams.get("minAmount"));
    }
    if (searchParams.get("maxAmount")) {
      filters.maxAmount = Number(searchParams.get("maxAmount"));
    }
    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!;
    }
    if (
      searchParams.get("isCompleted") !== null &&
      searchParams.get("isCompleted") !== undefined
    ) {
      const isCompletedValue = searchParams.get("isCompleted");
      if (isCompletedValue === "true") {
        filters.isCompleted = true;
      } else if (isCompletedValue === "false") {
        filters.isCompleted = false;
      }
    }

    // Construir query de MongoDB
    const query: any = {
      userId: currentUser.userId,
    };

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate + "T23:59:59.999Z");
      }
    }

    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }

    if (filters.paymentMethodId) {
      query.paymentMethodId = filters.paymentMethodId;
    }

    if (filters.minAmount !== undefined) {
      query.amount = { ...query.amount, $gte: filters.minAmount };
    }

    if (filters.maxAmount !== undefined) {
      query.amount = { ...query.amount, $lte: filters.maxAmount };
    }

    if (filters.search) {
      query.description = { $regex: filters.search, $options: "i" };
    }

    if (filters.isCompleted !== undefined) {
      query.isCompleted = filters.isCompleted;
    }

    // Optimizar query con proyección y límite
    const expenses = await Expense.find(query)
      .select(
        "amount description note isCompleted categoryId paymentMethodId date createdAt updatedAt"
      )
      .sort({ date: -1 })
      .limit(1000) // Límite para evitar cargar demasiados datos
      .lean();

    const formattedExpenses = expenses.map((exp) => ({
      id: exp._id.toString(),
      amount: exp.amount,
      description: exp.description,
      note: exp.note || undefined,
      isCompleted: exp.isCompleted || false,
      categoryId: exp.categoryId,
      paymentMethodId: exp.paymentMethodId,
      date: exp.date.toISOString(),
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedExpenses);
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses", message: error.message },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo gasto
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body: ExpenseFormData = await request.json();

    const expense = new Expense({
      userId: currentUser.userId,
      amount: body.amount,
      description: body.description,
      note: body.note || undefined,
      isCompleted: body.isCompleted || false,
      categoryId: body.categoryId,
      paymentMethodId: body.paymentMethodId,
      date: new Date(body.date),
    });

    const savedExpense = await expense.save();

    return NextResponse.json({
      id: (savedExpense._id as any).toString(),
      amount: savedExpense.amount,
      description: savedExpense.description,
      note: savedExpense.note || undefined,
      isCompleted: savedExpense.isCompleted || false,
      categoryId: savedExpense.categoryId,
      paymentMethodId: savedExpense.paymentMethodId,
      date: savedExpense.date.toISOString(),
      createdAt: savedExpense.createdAt.toISOString(),
      updatedAt: savedExpense.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense", message: error.message },
      { status: 500 }
    );
  }
}
