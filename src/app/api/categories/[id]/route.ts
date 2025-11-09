import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/auth";

// GET - Obtener una categoría por ID
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

    const category = await Category.findOne({
      _id: id,
      userId: currentUser.userId,
    }).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      color: category.color,
      icon: category.icon,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category", message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una categoría
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

    // Verificar que la categoría pertenece al usuario
    const existingCategory = await Category.findOne({
      _id: id,
      userId: currentUser.userId,
    }).lean();
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục hoặc bạn không có quyền chỉnh sửa" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.icon !== undefined) updateData.icon = body.icon;

    const category = await Category.findOneAndUpdate(
      { _id: id, userId: currentUser.userId },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      color: category.color,
      icon: category.icon,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    await connectDB();

    // Obtener el ID del parámetro (Next.js 15 puede requerir await)
    const { id } = await Promise.resolve(params);

    // Verificar que la categoría pertenece al usuario
    const existingCategory = await Category.findOne({
      _id: id,
      userId: currentUser.userId,
    }).lean();
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục hoặc bạn không có quyền xóa" },
        { status: 404 }
      );
    }

    const category = await Category.findOneAndDelete({
      _id: id,
      userId: currentUser.userId,
    });

    if (!category) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa danh mục", message: error.message },
      { status: 500 }
    );
  }
}
