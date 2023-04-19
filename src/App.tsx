import { useState, useRef } from 'react';
import { MapRef } from 'react-map-gl';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Form from './components/Form';
import Map from './components/Map';

import theme from './theme';

export interface CatchmentStation {
  catchmentUuid: string;
  stationSid: string;
  trainingDateRange?: string;
  validationDateRange?: string;
}

function App() {
  const [selectedStation, setSelectedStation] =
    useState<null | mapboxgl.MapboxGeoJSONFeature>(null);
  const [catchmentStations, setCatchmentStations] = useState<
    CatchmentStation[]
  >([]);
  const mapRef = useRef<MapRef>(null);

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <Grid
        container
        sx={{
          fontFamily: 'HurmeBoldWoff2',
        }}
      >
        <Grid item xs={12} md={4}>
          <Form
            mapRef={mapRef}
            selectedStation={selectedStation}
            catchmentStations={catchmentStations}
            setCatchmentStations={setCatchmentStations}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            ref={mapRef}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            catchmentStations={catchmentStations}
            setCatchmentStations={setCatchmentStations}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
