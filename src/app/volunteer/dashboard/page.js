'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { IconCheck, IconX } from '@tabler/icons-react';
import HoverDevCards from './card';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement);

const VolunteerDashboard = () => {
  const { data: session } = useSession();
  const [volunteerData, setVolunteerData] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const res = await fetch(`/api/volunteer/${session.user.id}`);
          const data = await res.json();
          setVolunteerData(data);
        } catch (error) {
          console.error('Error fetching volunteer data:', error);
        }
      }
    };

    fetchData();
  }, [session]);

  const handleResponse = async (accidentId, action) => {
    if (!accidentId) {
      console.error('Accident ID is undefined');
      toast.error('Accident ID is missing');
      return;
    }

    setUpdatingStatus(true);

    try {
      const status = action === 'accept' ? 'In Progress' : 'Rejected';
      const res = await fetch(`/api/accidents/${accidentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Accident ${action}ed successfully`);
        const updatedRes = await fetch(`/api/volunteer/${session.user.id}`);
        const updatedData = await updatedRes.json();
        setVolunteerData(updatedData);
      } else {
        toast.error('Failed to update accident status');
      }
    } catch (error) {
      console.error('Error updating accident status:', error);
      toast.error('Error updating accident status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!volunteerData) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  const doughnutData = {
    labels: ['Accepted', 'Rejected', 'Pending'],
    datasets: [
      {
        label: 'Accident Status Distribution',
        data: [
          volunteerData.accidentHistory.filter(item => item.status === 'In Progress').length,
          volunteerData.accidentHistory.filter(item => item.status === 'Rejected').length,
          volunteerData.liveNotifications.length,
        ],
        backgroundColor: ['#4CAF50', '#F44336', '#FF9800'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350', '#FFB74D'],
      },
    ],
  };

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Dummy months
  datasets: [
    {
      label: 'Accidents Over Time',
      data: [5, 10, 7, 12, 8, 9, 11, 14, 10, 6, 7, 13], 
      fill: false,
      borderColor: '#4CAF50', 
      borderWidth: 2, 
      tension: 0.1,
    },
  ],
};

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Accidents by Month',
        data: [15, 30, 25, 40, 35, 50, 45], 
        backgroundColor: '#FF9800',
      },
    ],
  };

  const additionalLineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Accidents Trend',
        data: [10, 25, 20, 35], 
        fill: false,
        borderColor: '#F44336',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Top Section - Volunteer Info */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold">{volunteerData.name}</h1>
        <p className="mt-4 text-lg text-gray-400">{volunteerData.description}</p>
      </div>

      {/* Top Section - Metric Cards */}
      <HoverDevCards/>

      {/* Accident Response History - Table Format */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Accident Response History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-4 px-6 text-left text-gray-300">Date</th>
                <th className="py-4 px-6 text-left text-gray-300">Location</th>
                <th className="py-4 px-6 text-left text-gray-300">Description</th>
                <th className="py-4 px-6 text-left text-gray-300">Status</th>
                <th className="py-4 px-6 text-left text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {volunteerData.accidentHistory.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-4 px-6">{item.date}</td>
                  <td className="py-4 px-6">{item.location.type}, {item.location.coordinates.join(', ')}</td>
                  <td className="py-4 px-6">{item.description}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'In Progress' ? 'bg-green-100 text-green-800' : item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {item.status === 'In Progress' ? (
                      <IconCheck size={24} className="text-green-500" />
                    ) : (
                      <IconX size={24} className="text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Accident Status Distribution</h2>
          <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Accidents Over Time</h2>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Accidents by Month</h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Accidents Trend</h2>
          <Line data={additionalLineData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
