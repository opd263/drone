// apps/web/src/hooks/useFeed.ts
'use client';

import { useEffect, useState } from 'react';
import { DroneFeed } from '../../../shared/types/drone';
import { api } from '../Constants';

export function useFeed(droneId: string | null) {
  const [feed, setFeed] = useState<DroneFeed | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!droneId) {
      setFeed(null);
      return;
    }

    let stopped = false;
    const tick = async () => {
      try {
        const { data } = await api.get<DroneFeed>(`/api/drones/${droneId}/feed`);
        if (!stopped) setFeed(data);
      } catch (err) {
        if (!stopped) setError(err as Error);
      }
    };

    // Initial fetch
    tick();
    // Poll every 3s
    const id = setInterval(tick, 3000);

    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [droneId]);

  return {
    feed,
    error,
    isLoading: !error && feed === null && !!droneId,
  };
}
