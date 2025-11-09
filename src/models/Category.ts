import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  userId?: string;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
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
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i,
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
CategorySchema.index({ userId: 1, name: 1 }, { unique: true, sparse: true });

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
