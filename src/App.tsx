import { useState } from 'react';
import './App.css';

import Form from './components/Form';
import Map from './components/Map';

function App() {
  const [selectedStation, setSelectedStation] =
    useState<null | mapboxgl.MapboxGeoJSONFeature>(null);

  return (
    <div className="App">
      <Form selectedStation={selectedStation} />
      <Map
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
    </div>
  );
}

export default App;
