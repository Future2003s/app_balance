import { NextResponse } from "next/server";
import { initDefaultData } from "@/lib/initDefaultData";

// POST - Inicializar datos por defecto
export async function POST() {
  try {
    await initDefaultData();
    return NextResponse.json({
      success: true,
      message: "Default data initialized",
    });
  } catch (error: any) {
    console.error("Error initializing default data:", error);
    return NextResponse.json(
      { error: "Failed to initialize default data", message: error.message },
      { status: 500 }
    );
  }
}
