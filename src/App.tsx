import { useEffect, useState } from 'react';
import './App.css';

import Form from './components/Form';
import Map from './components/Map';

function App() {
  const [stations, setStations] = useState<null | any>(null);
  const [selectedStation, setSelectedStation] =
    useState<null | mapboxgl.MapboxGeoJSONFeature>(null);
  const [catchments, setCatchments] = useState<null | any>(null);

  useEffect(() => {
    fetch('/data/climate_stations.geojson')
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          setStations(data);
        }, Math.round(Math.random() * 5000));
      });
    fetch('/data/All_Catchment_Boundaries.geojson')
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          setCatchments(data);
        }, Math.round(Math.random() * 5000));
      });
  }, []);

  return (
    <div className="App">
      <Form
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        catchments={catchments}
      />
      <Map
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        stations={stations}
        catchments={catchments}
      />
    </div>
  );
}

export default App;
