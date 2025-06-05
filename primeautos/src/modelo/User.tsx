import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "El correo electrónico no es válido",
      },
    },
    password: { 
      type: String, 
      required: true, 
    },
    role: { 
      type: String, 
      enum: ["admin", "usuario"], 
      default: "usuario",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
