import connectDB from '@/dbconfig/dbconfig';
import Accident from '@/models/accident';
import { NextResponse } from 'next/server';

await connectDB();

export const PATCH= async(req, res, {params})=>{

  const id  = params.id;
  const { status } = req.body;

    try {
      const updatedAccident = await Accident.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedAccident) {
        return res.status(404).json({ message: 'Accident not found' });
      }
      return NextResponse.json(updatedAccident,{status: 201});
    } catch (error) {
      return NextResponse.json({message: 'Server error',error},{status: 500});
    }
}
