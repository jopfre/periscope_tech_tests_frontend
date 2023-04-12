import { useEffect, useState } from 'react';

export const useClimateStations = () => {
  const [stations, setStations] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/climate_stations.geojson')
      .then((response) => response.json())
      .then((data) => {
        setStations(data);
        setLoading(false);
      });
  }, []);

  return { stations, loading };
};
