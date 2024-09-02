import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/dbconfig/dbconfig';
import Accident from '@/models/accident';
import Volunteer from '@/models/volunteer';

connectDB();

export const POST = async (req) => {
  try {
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
      hospital: hospital || "60b8d295f2bfcf001c8b4567",
      nearestVolunteers: [], 
    };

    const nearestVolunteers = await Volunteer.find({
      location: {
        $near: {
          $geometry: accidentData.location,
          $maxDistance: 5000, 
        }
      }
    }).limit(2); 
    console.log('the two volunteers are ',nearestVolunteers);

    accidentData.nearestVolunteers = nearestVolunteers.map(volunteer => volunteer._id);

    const accident = new Accident(accidentData);
    await accident.save();

    for (const volunteer of nearestVolunteers) {
      volunteer.liveAccidents.push(accident._id);
      await volunteer.save();
    }

    return NextResponse.json({ message: 'Accident reported successfully!', nearestVolunteers: accidentData.nearestVolunteers });
  } catch (error) {
    console.error('Error reporting accident:', error);
    return NextResponse.json({ error: 'Failed to report accident' }, { status: 500 });
  }
};
