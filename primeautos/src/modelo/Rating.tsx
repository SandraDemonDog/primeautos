import mongoose, { Schema, model, models} from "mongoose";

const ratingSchema = new Schema(
   {
    serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Service", 
        required: true, 
    }, 
    
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5, 
    }, 
    comment: { 
        type: String, 
        maxlength: 500 
    }, 
    createdAt: { 
        type: Date, 
        default: Date.now, 
    }, 
    });

const Rating = models.Rating || model("Rating", ratingSchema);

export default Rating;
