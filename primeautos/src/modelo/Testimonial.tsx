import { Schema, model, models } from "mongoose";


const TestimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [100, "El nombre no puede tener más de 100 caracteres"],
    },
    comment: {
      es: {
        type: String,
        required: [true, "El comentario en español es obligatorio"],
        trim: true,
        maxlength: [500, "El comentario no puede tener más de 500 caracteres"],
      },
      en: {
        type: String,
        required: [true, "El comentario en inglés es obligatorio"],
        trim: true,
        maxlength: [500, "El comentario no puede tener más de 500 caracteres"],
      }
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    updatedAt: {
      type: Date, 
    },
  },
  { timestamps: true } 
);

const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);

export default Testimonial;
