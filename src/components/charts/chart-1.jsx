import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const AnalyticsDashboard = () => {
  // Sample data - replace with your actual data
  const statusData = {
    labels: ['Delivered', 'In Transit', 'Delayed', 'Processing'],
    datasets: [
      {
        data: [65, 25, 7, 3],
        backgroundColor: [
          '#10B981', // green
          '#3B82F6', // blue
          '#EF4444', // red
          '#F59E0B', // yellow
        ],
        borderWidth: 1,
      },
    ],
  };

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'On Time',
        data: [12, 15, 18, 11, 17],
        backgroundColor: '#10B981',
      },
      {
        label: 'Delayed',
        data: [3, 2, 5, 4, 1],
        backgroundColor: '#EF4444',
      },
    ],
  };

  return (
    <>
      <div className="p-4">
        <h2 className="mb-6 text-2xl font-bold">Shipment Analytics</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Status Distribution Pie Chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">Shipment Status</h3>
            <div className="h-64">
              <Pie
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* On-Time Performance Bar Chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">On-Time Performance</h3>
            <div className="h-64">
              <Bar
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
