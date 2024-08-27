import { NextResponse } from 'next/server';
import Accident from '@/models/accident';
import mongoose from 'mongoose';

export const POST = async (req) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const { description, reporters, photos, videos, location, hospital } = await req.json();

    const accidentData = {
      description: description || 'No description provided',
      reporters: reporters || ['default@example.com'], 
      photos: photos || [],       
      videos: videos || [],       
      location: location || {
        type: 'Point',
        coordinates: [0, 0], 
      },
      hospital: "60b8d295f2bfcf001c8b4567", 
      nearestVolunteers: [],  
    };
    const accident = new Accident(accidentData);
    await accident.save();

    return NextResponse.json({ message: 'Accident reported successfully!' });
  } catch (error) {
    console.error('Error reporting accident:', error);
    return NextResponse.json({ error: 'Failed to report accident' }, { status: 500 });
  }
};
