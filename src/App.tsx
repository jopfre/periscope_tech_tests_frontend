import { useEffect, useRef, useState } from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Layer, Source, MapRef } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import Form from './components/Form';

const projectCenter = [-103.47180301341449, 51.81286542594248] as const;
const REACT_APP_MAPBOX_TOKEN =
  'pk.eyJ1IjoibGFycnlib2x0IiwiYSI6ImNsZnJ5ZXhjZTAwd3YzaHNjaDVxM2FraW4ifQ.zqbty_M1cm7fkFY9gTvrLg';
if (!REACT_APP_MAPBOX_TOKEN)
  throw new Error('REACT_APP_MAPBOX_TOKEN is not defined');

function App() {
  const mapRef = useRef<MapRef>();

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

  const handleClickFeature = (e: mapboxgl.MapLayerMouseEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(e.point, {
      layers: ['catchments', 'stations'],
    });
    if (!features?.[0]?.properties) {
      setSelectedStation(null);
      return;
    }
    const feature = features[0];

    if (feature.properties?.station_sid) {
      setSelectedStation(feature);
      console.log('Clicked on station', feature.properties.station_sid);
      return;
    }
    if (feature.properties?.node_type) {
      console.log('Clicked on catchment', feature.properties.uuid);
    }
  };

  return (
    <div className="App">
      <Form
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        catchments={catchments}
      />
      <div className="Map">
        <Map
          initialViewState={{
            longitude: projectCenter[0],
            latitude: projectCenter[1],
            zoom: 7,
          }}
          style={{ width: '100%', height: '100vh' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
          ref={mapRef as any}
          onClick={handleClickFeature}
        >
          <Source type="geojson" data={stations}>
            <Layer
              id="stations"
              type="circle"
              paint={{
                'circle-color': 'blue',
                'circle-opacity': 0.3,
                'circle-radius': 15,
              }}
            />
          </Source>
          <Source type="geojson" data={catchments}>
            <Layer
              id="catchments"
              beforeId="stations"
              type="fill"
              paint={{
                'fill-opacity': 0.5,
              }}
            />
            <Layer
              id="catchments_labels"
              type="symbol"
              paint={{
                'text-color': 'black',
              }}
              layout={{
                'text-field': ['get', 'name'],
              }}
            />
          </Source>
          {!selectedStation ? null : (
            <Source type="geojson" data={selectedStation}>
              <Layer
                id="selected-station"
                type="circle"
                paint={{
                  'circle-color': 'red',
                  'circle-opacity': 0.4,
                  'circle-radius': 15,
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
}

export default App;
