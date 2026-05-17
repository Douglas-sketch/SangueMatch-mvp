import { useCallback, useEffect, useState } from 'react';
import { fetchNearbyBloodCenters } from '../utils/places';
import { useApp } from '../context/AppContext';

export function useHemocenters(autoLoad = true) {
  const { location, requestAndStoreLocation } = useApp();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { location: freshLocation } = await requestAndStoreLocation();
      const list = await fetchNearbyBloodCenters(freshLocation || location);
      setCenters(list);
      setUsingFallback(list.some((item) => item.source === 'fallback'));
    } finally {
      setLoading(false);
    }
  }, [location, requestAndStoreLocation]);

  useEffect(() => {
    if (autoLoad) load();
    // Carrega automaticamente apenas ao montar para evitar loop ao atualizar a localização.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  return { centers, loading, usingFallback, reload: load };
}
