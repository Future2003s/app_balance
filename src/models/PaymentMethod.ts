import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaymentMethod extends Document {
  userId?: string;
  name: string;
  icon: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: false,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para búsquedas por usuario
PaymentMethodSchema.index({ userId: 1, name: 1 }, { unique: true, sparse: true });

const PaymentMethod: Model<IPaymentMethod> =
  mongoose.models.PaymentMethod ||
  mongoose.model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;
