import { Schema, model, models } from "mongoose";


const contactFormSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [50, "El nombre no puede exceder los 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
        },
        message: "El correo electrónico no es válido",
      },
    },
    message: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      trim: true,
      maxlength: [500, "El mensaje no puede exceder los 500 caracteres"],
    },
    date: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  }
);

const ContactForm = models.ContactForm || model("ContactForm", contactFormSchema);

export default ContactForm;
