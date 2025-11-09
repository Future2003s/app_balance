import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  userId: string;
  amount: number;
  description: string;
  note?: string;
  isCompleted: boolean;
  categoryId: string;
  paymentMethodId: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    note: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    isCompleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    categoryId: {
      type: String,
      required: true,
    },
    paymentMethodId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Crear índice para búsquedas más rápidas
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, categoryId: 1 });
ExpenseSchema.index({ userId: 1, paymentMethodId: 1 });

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
