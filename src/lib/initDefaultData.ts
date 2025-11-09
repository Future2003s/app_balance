import connectDB from "./mongodb";
import PaymentMethod from "@/models/PaymentMethod";
import { DEFAULT_PAYMENT_METHODS } from "@/lib/constants/paymentMethods";

export async function initDefaultData() {
  try {
    await connectDB();

    // Inicializar métodos de pago por defecto
    const existingPaymentMethods = await PaymentMethod.countDocuments({
      isDefault: true,
    });
    if (existingPaymentMethods === 0) {
      const paymentMethods = DEFAULT_PAYMENT_METHODS.map((pm) => ({
        name: pm.name,
        icon: pm.icon,
        isDefault: true,
      }));
      await PaymentMethod.insertMany(paymentMethods);
      console.log("✅ Default payment methods initialized");
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
}
