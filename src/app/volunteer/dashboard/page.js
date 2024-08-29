'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const VolunteerDashboard = () => {
  const { data: session } = useSession();
  const [volunteerData, setVolunteerData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        console.log(session);
        console.log('Fetching data for user ID:', session.user.id); // Log the ID to check

        try {
          const res = await fetch(`/api/volunteer/${session.user.id}`);
          const data = await res.json();
          console.log(data);
          setVolunteerData(data);
        } catch (error) {
          console.error('Error fetching volunteer data:', error);
        }
      }
    };

    fetchData();
  }, [session]);

  if (!volunteerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold">{volunteerData.name}</h1>
        <p className="mt-4 text-lg text-gray-600">{volunteerData.description}</p>
      </div>
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Accident Response History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {volunteerData.accidentHistory.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-2 text-sm font-bold text-gray-700">{item.type}</div>
              <div className="text-xl font-bold">
                Location Type: {item.location.type}
                <br />
                Coordinates: {item.location.coordinates.join(', ')}
              </div>
              <div className="text-gray-600">{item.date}</div>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-6">Live Accident Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {volunteerData.liveNotifications.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-2 text-sm font-bold text-gray-700">{item.type}</div>
              <div className="text-xl font-bold">
                Location Type: {item.location.type}
                <br />
                Coordinates: {item.location.coordinates.join(', ')}
              </div>
              <div className="text-gray-600">{item.date}</div>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Respond</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
