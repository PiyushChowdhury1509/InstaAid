import mongoose from "mongoose";

const AccidentSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    photos: [{
        type: String, 
    }],
    videos: [{
        type: String, 
    }],
    reporters: [{
        type: String, 
    }],
    nearestVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer', 
    }],
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', 
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
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Cancelled'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

AccidentSchema.index({ location: '2dsphere' }); 

const Accident = mongoose.models.Accident ||  mongoose.model('Accident', AccidentSchema);

export default Accident;
