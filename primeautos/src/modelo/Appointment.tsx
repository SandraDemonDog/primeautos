import { Schema, model, models } from "mongoose";


const appointmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true, 
    },
    time: { 
        type: String, 
        required: true, 
    }, 
    status: {
      type: String,
      enum: ["Pendiente", "Confirmada", "Rechazada"],
      default: "Pendiente", 
    },
  },
  {
    timestamps: true, 
  }
);

const Appointment = models.Appointment || model("Appointment", appointmentSchema);

export default Appointment;
