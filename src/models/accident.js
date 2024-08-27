const mongoose = require('mongoose');

const AccidentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    photos: [{
        type: String, 
    }],
    videos: [{
        type: String, 
    }],
    reporters: [{
        type: String, 
        required: true,
    }],
    nearestVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer', 
        required: true,
    }],
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', 
        required: true,
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
}, {
    timestamps: true,
});

AccidentSchema.index({ location: '2dsphere' }); 

const Accident = mongoose.models.Accident ||  mongoose.model('Accident', AccidentSchema);

export default Accident;
