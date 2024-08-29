import mongoose from "mongoose";
const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyToken: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
}, { timestamps: true });

const Volunteer = mongoose.models.volunteer || mongoose.model("volunteer", volunteerSchema);

export default Volunteer;
