import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // Generar token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    // Crear respuesta con cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );

    // Establecer cookie httpOnly
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { error: "Lỗi khi đăng nhập", message: error.message },
      { status: 500 }
    );
  }
}

