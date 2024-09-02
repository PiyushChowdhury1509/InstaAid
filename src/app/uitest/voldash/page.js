'use client'
import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend);

const VolunteerDashboard = () => {
  const reportsData = {
    labels: ['Received', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [25, 10, 15],
        backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
        borderColor: '#1F2937',
      },
    ],
  };

  const responseTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Response Time (minutes)',
        data: [10, 15, 8, 12, 9, 10, 7, 14, 6, 11, 10, 9],
        borderColor: '#F472B6',
        backgroundColor: 'rgba(244, 114, 182, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const reportsOverviewData = {
    datasets: [
      {
        label: 'Reports Overview',
        data: [70, 30],
        backgroundColor: ['#3B82F6', '#E5E7EB'],
        borderColor: '#1F2937',
      },
    ],
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h2 className="text-4xl font-bold mb-8">Volunteer Dashboard</h2>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-bold">Total Reports</h3>
          <p className="text-4xl font-bold mt-2">50</p>
          <p className="text-gray-400 mt-2">This Month</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-bold">Active Reports</h3>
          <p className="text-4xl font-bold mt-2">10</p>
          <p className="text-gray-400 mt-2">Currently being addressed</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-bold">Average Response Time</h3>
          <p className="text-4xl font-bold mt-2">10 mins</p>
          <p className="text-gray-400 mt-2">Last 30 days</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-bold">Reports Sent to Hospital</h3>
          <p className="text-4xl font-bold mt-2">15</p>
          <p className="text-gray-400 mt-2">This Month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Reports Overview</h3>
          <div className="flex justify-center items-center">
            <div className="relative w-24 h-24">
              <Doughnut data={reportsOverviewData} options={{ cutout: '75%', responsive: true }} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Response Time Trend</h3>
          <div className="h-40">
            <Line data={responseTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-bold mb-4">Reports Status</h3>
        <div className="h-40">
          <Doughnut data={reportsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Report #1234</span>
            <span className="text-green-500">Sent to Hospital</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Report #1235</span>
            <span className="text-yellow-500">In Progress</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Report #1236</span>
            <span className="text-green-500">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
