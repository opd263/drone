// apps/web/src/hooks/useVitals.ts
'use client';

import useSWR from 'swr';
import { DroneVitals } from '../../../shared/types/drone';
import { api } from '../Constants';

const fetcher = (url: string) => api.get<DroneVitals>(url).then(r => r.data);

export function useVitals(droneId: string | null) {
  const { data, error, isValidating, mutate } = useSWR<DroneVitals>(
    droneId ? `/api/drones/${droneId}/vitals` : null,
    fetcher,
    { refreshInterval: 3000 }
  );

  return {
    vitals: data,
    isLoading: !error && !data,
    isError: !!error,
    isValidating,
    refresh: mutate,
  };
}
