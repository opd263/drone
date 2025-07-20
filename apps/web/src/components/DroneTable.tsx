'use client';

import useSWR from 'swr';
import { DroneMeta } from '../../../shared/types/drone';
import { api } from '../Constants';

export default function DroneTable({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const fetcher = (url: string) => api.get<DroneMeta[]>(url).then(r => r.data);
  const { data, error } = useSWR('/api/drones', fetcher, { refreshInterval: 5000 });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'flying':
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'idle':
      case 'standby':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'offline':
      case 'error':
      case 'maintenance':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'flying':
        return '🚁';
      case 'online':
        return '🟢';
      case 'idle':
      case 'standby':
        return '⏸️';
      case 'offline':
        return '🔴';
      case 'error':
        return '⚠️';
      case 'maintenance':
        return '🔧';
      default:
        return '📡';
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Connection Error
          </h3>
          <p className="text-red-500 dark:text-red-300">
            Unable to load drone data. Please check your connection.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Loading Drones
          </h3>
          <p className="text-blue-500 dark:text-blue-300">
            Fetching latest drone data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🚁 Drone Fleet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Click on any drone to view detailed information
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-white/30">
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg">Drone Name</h3>
            </div>
            <div className="text-center">
              <h3 className="text-white font-semibold text-lg">Status</h3>
            </div>
          </div>
        </div>

        {/* Table Body */}
<div className="divide-y divide-gray-200 dark:divide-gray-700 border-b border-gray-300 dark:border-gray-700">
          {data.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🚁</div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Drones Available
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                No drones are currently registered in the system.
              </p>
            </div>
          ) : (
            data.map((drone, index) => (
              <div
                key={drone.id}
                onClick={() => onSelect(drone.id)}
                className="grid grid-cols-2 gap-4 p-4 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transform hover:scale-102 group"
              >
                {/* Drone Name */}
                <div className="text-center flex items-center justify-center">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-3 group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-800 dark:group-hover:to-indigo-800 transition-all duration-200">
                    <div className="text-2xl mb-1">🚁</div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                      {drone.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {drone.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center flex items-center justify-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${getStatusColor(drone.status)}`}>
                    <span className="text-lg">{getStatusIcon(drone.status)}</span>
                    <span className="capitalize">{drone.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {data.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Drones: <span className="font-semibold text-blue-600 dark:text-blue-400">{data.length}</span>
              {' • '}
              <span className="text-xs">Auto-refresh every 3s</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}