'use client';
import { useState } from 'react';
import DroneTable from '@/components/DroneTable';
import DroneViewer from '@/components/DroneViewer';

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Drone List */}
        <div className="lg:w-1/3">
          <DroneTable onSelect={(id: string) => setSelectedId(id)} />
        </div>

        {/* Drone Details */}
        <div className="lg:w-2/3">
          {selectedId ? (
            <DroneViewer droneId={selectedId} />
          ) : (
            <div className="h-full flex items-center justify-center border rounded p-6 bg-gray-50 dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Select a drone to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
