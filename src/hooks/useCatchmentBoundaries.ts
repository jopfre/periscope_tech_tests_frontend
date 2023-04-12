import { useEffect, useState } from 'react';

export const useCatchmentBoundaries = () => {
  const [catchments, setCatchments] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/All_Catchment_Boundaries.geojson')
      .then((response) => response.json())
      .then((data) => {
        setCatchments(data);
        setLoading(false);
      });
  }, []);

  return { catchments, loading };
};
