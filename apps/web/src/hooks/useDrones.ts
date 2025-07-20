// apps/web/src/hooks/useDrones.ts
'use client';

import useSWR from 'swr';
import { DroneMeta } from '../../../shared/types/drone';
import { api } from '../Constants';

const fetcher = (url: string) => api.get<DroneMeta[]>(url).then(r => r.data);

export function useDrones() {
  const { data, error, isValidating, mutate } = useSWR<DroneMeta[]>(
    '/api/drones',
    fetcher,
    { refreshInterval: 3000 }
  );

  return {
    drones: data,
    isLoading: !error && !data,
    isError: !!error,
    isValidating,
    refresh: mutate,
  };
}