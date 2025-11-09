import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, name } = body;

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
    });

    const savedUser = await user.save();

    // Generar token
    const token = generateToken({
      userId: (savedUser._id as any).toString(),
      email: savedUser.email,
    });

    // Crear respuesta con cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: (savedUser._id as any).toString(),
          email: savedUser.email,
          name: savedUser.name,
        },
      },
      { status: 201 }
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
    console.error("Error registering user:", error);
    console.error("Error details:", {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    
    // Manejar errores específicos de MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 400 }
      );
    }
    
    // Manejar errores de autenticación de MongoDB
    if (error.message?.includes("authentication failed") || error.message?.includes("bad auth")) {
      return NextResponse.json(
        { error: "Lỗi kết nối cơ sở dữ liệu. Vui lòng kiểm tra cấu hình." },
        { status: 500 }
      );
    }
    
    // Manejar errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0] as any;
      return NextResponse.json(
        { error: firstError?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Lỗi khi đăng ký", 
        message: error.message || "Vui lòng thử lại sau" 
      },
      { status: 500 }
    );
  }
}

