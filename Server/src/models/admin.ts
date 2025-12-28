import mongoose, { Schema, Document, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin {
  name: string;
  email: string;
  password: string | null;
  role: 'super-admin' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type AdminModel = mongoose.Model<IAdmin, {}, IAdminMethods>;

const SALT_ROUNDS = 10;

const AdminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    role: {
      type: String,
      enum: ['super-admin', 'admin'],
      default: 'admin'
    }
  },
  { timestamps: true }
);

// Hash password before saving
AdminSchema.pre('save', async function () {
  if (!this.isModified('password') || this.password === null) {
    return;
  }
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.model<IAdmin, AdminModel>('Admin', AdminSchema, 'admin');
