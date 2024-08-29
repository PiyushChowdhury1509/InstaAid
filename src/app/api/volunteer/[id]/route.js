import mongoose from 'mongoose';
import connectDB from '@/dbconfig/dbconfig';
import Accident from '@/models/accident'; // Move this import above Volunteer
import Volunteer from '@/models/volunteer';
import { NextResponse } from 'next/server';

connectDB();

export const GET = async (req, { params }) => {
  const { id } = params;

  try {
    const volunteer = await Volunteer.findById(id)
      .populate('liveAccidents')
      .populate('solvedAccidents')
      .populate('unsolvedAccidents');

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const accidentHistory = [
      ...volunteer.liveAccidents.map(accident => ({
        type: 'Live Accident',
        location: accident.location,
        date: accident.date,
        description: accident.description,
      })),
      ...volunteer.solvedAccidents.map(accident => ({
        type: 'Solved Accident',
        location: accident.location,
        date: accident.date,
        description: accident.description,
      })),
      ...volunteer.unsolvedAccidents.map(accident => ({
        type: 'Unsolved Accident',
        location: accident.location,
        date: accident.date,
        description: accident.description,
      })),
    ];

    return NextResponse.json({
      name: volunteer.username,
      description: 'Volunteer description',
      accidentHistory,
      liveNotifications: accidentHistory.filter(accident => accident.type === 'Live Accident'), // Adjust as needed
    });
  } catch (error) {
    console.error('Error fetching volunteer data:', error);
    return NextResponse.json({ error: 'Failed to fetch volunteer data' }, { status: 500 });
  }
};
