'use client';

import { useEffect, useState } from 'react';
import { DroneVitals, DroneFeed, Drone } from '../../../shared/types/drone';
import ConfirmDialog from './ConfirmDialog';
import { api, socket } from '../Constants';

interface WSUpdate {
  type: 'init' | 'update';
  drones: Drone[];
  timestamp?: string;
}

export default function DroneViewer({ droneId }: { droneId: string }) {
  const [vitals, setVitals] = useState<DroneVitals | null>(null);
  const [feed, setFeed] = useState<DroneFeed | null>(null);
  const [action, setAction] = useState<'pause' | 'return'>('pause');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!droneId || !socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data: WSUpdate = JSON.parse(event.data);
      const drone = data.drones.find(d => d.id === droneId);
      if (!drone) return;

      setVitals({
        temperature: drone.temperature,
        battery: drone.battery,
        signal: drone.signal,
      });

      setFeed({
        imageBase64: drone.image,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [droneId]);

  const confirm = async () => {
    await api.post(`/api/drones/${droneId}/command`, { action });
    setOpen(false);
  };

  const getBatteryColor = (battery?: number) => {
    if (!battery) return 'text-gray-500';
    if (battery > 60) return 'text-green-500';
    if (battery > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalStrength = (signal?: number) => {
    if (!signal) return 'Poor';
    if (signal > -50) return 'Excellent';
    if (signal > -70) return 'Good';
    if (signal > -85) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:shadow-2xl hover:scale-100">
      <div className="relative flex flex-col items-center gap-4 py-6 my-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
        {feed ? (
          <div className="relative">
            <img
              className="w-20 h-20 object-cover rounded-xl shadow-lg border-4 border-white dark:border-gray-600"
              src={`data:image/png;base64,${feed.imageBase64}`}
              alt="Live feed"
            />
          </div>
        ) : (
          <div className="w-48 h-40 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm">Loading feed...</p>
            </div>
          </div>
        )}

        <div className="mt-18 w-full px-6">
          <ConfirmDialog
            open={open}
            title={`Confirm ${action}`}
            onClose={() => setOpen(false)}
            onConfirm={confirm}
            inline={true}
          >
            Are you sure you want to <b>{action}</b> this drone?
          </ConfirmDialog>
        </div>
      </div>

      {!open && (
        <div className="p-6 text-center space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg inline-block">
            📡 Last Update: {feed?.timestamp || 'N/A'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
              <div className="text-2xl mb-1">🌡️</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {vitals?.temperature.toFixed(1) || '--'}°C
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
              <div className="text-2xl mb-1">🔋</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Battery</div>
              <div className={`text-xl font-bold ${getBatteryColor(vitals?.battery)}`}>
                {vitals?.battery.toFixed(0) || '--'}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-2xl mb-1">📶</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Signal</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {vitals?.signal.toFixed(0) || '--'}dBm
              </div>
              <div className="text-xs text-blue-500 dark:text-blue-400">
                {getSignalStrength(vitals?.signal)}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setAction('pause');
                setOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:from-yellow-600 hover:to-orange-600 transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              ⏸️ Pause Mission
            </button>
            <button
              onClick={() => {
                setAction('return');
                setOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              🏠 Return to Base
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
