import MapGL, { Layer, Source, MapRef, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useClimateStations } from '../hooks/useClimateStations';
import { useCatchmentBoundaries } from '../hooks/useCatchmentBoundaries';
import { forwardRef, useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';

import Pin from './Pin';

interface MapProps {
  selectedStation: mapboxgl.MapboxGeoJSONFeature | null;
  setSelectedStation: React.Dispatch<
    React.SetStateAction<mapboxgl.MapboxGeoJSONFeature | null>
  >;
}

const Map = forwardRef<MapRef, MapProps>(
  ({ selectedStation, setSelectedStation }, ref) => {
    const projectCenter = [-103.47180301341449, 51.81286542594248] as const;

    const REACT_APP_MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
    if (!REACT_APP_MAPBOX_TOKEN)
      throw new Error('REACT_APP_MAPBOX_TOKEN is not defined');

    const { stations, loading: stationsLoading } = useClimateStations();
    const { catchments, loading: catchmentsLoading } = useCatchmentBoundaries();

    const handleClickFeature = (e: mapboxgl.MapLayerMouseEvent) => {
      if (ref != null && typeof ref !== 'function') {
        const features = ref?.current?.queryRenderedFeatures(e.point, {
          // layers: ['catchment-fills', 'stations'],
          layers: ['catchment-fills'],
        });
        if (!features?.[0]?.properties) {
          setSelectedStation(null);
          return;
        }
        const feature = features[0];
        // if (feature.properties?.station_sid) {
        //   setSelectedStation(feature);
        //   console.log('Clicked on station', feature.properties.station_sid);
        //   return;
        // }
        if (feature.properties?.node_type) {
          console.log('Clicked on catchment', feature.properties.uuid);
        }
      }
    };

    const pins = useMemo(() => {
      if (stations?.features?.length > 0) {
        return stations.features.map(
          (feature: mapboxgl.MapboxGeoJSONFeature) => {
            return (
              <Marker
                key={feature.properties?.station_sid}
                longitude={
                  feature.geometry.type === 'Point'
                    ? feature.geometry.coordinates[0]
                    : undefined
                }
                latitude={
                  feature.geometry.type === 'Point'
                    ? feature.geometry.coordinates[1]
                    : undefined
                }
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedStation(feature);
                  console.log(
                    'Clicked on station',
                    feature.properties?.station_sid,
                  );
                }}
              >
                <Pin />
              </Marker>
            );
          },
        );
      }
    }, [stations]);

    return (
      <div className="Map">
        {stationsLoading || catchmentsLoading ? (
          'Loading'
        ) : (
          <MapGL
            initialViewState={{
              longitude: projectCenter[0],
              latitude: projectCenter[1],
              zoom: 7,
            }}
            style={{ width: '100%', height: '100vh' }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
            ref={ref}
            onClick={handleClickFeature}
          >
            {pins}
            {console.log(selectedStation)}
            {selectedStation && (
              <Popup
                anchor="top"
                longitude={Number(
                  selectedStation.geometry.type === 'Point'
                    ? selectedStation.geometry.coordinates[0]
                    : undefined,
                )}
                latitude={Number(
                  selectedStation.geometry.type === 'Point'
                    ? selectedStation.geometry.coordinates[1]
                    : undefined,
                )}
                onClose={() => setSelectedStation(null)}
              >
                <Typography variant="h3" gutterBottom>
                  {selectedStation.properties?.name}
                </Typography>
                <Typography gutterBottom>
                  Elevation: {selectedStation.properties?.elevation}m
                </Typography>
                <Typography gutterBottom>
                  ID: {selectedStation.properties?.station_id}
                </Typography>
                <Typography sx={{ overflowWrap: 'break-word' }}>
                  SID: {selectedStation.properties?.station_sid}
                </Typography>
              </Popup>
            )}
            {/* <Source type="geojson" data={stations}>
              <Layer
                id="stations"
                type="circle"
                paint={{
                  'circle-color': 'blue',
                  'circle-opacity': 0.3,
                  'circle-radius': 15,
                }}
              />
            </Source> */}

            <Source
              type="geojson"
              data={catchments}
              promoteId="uuid"
              id="catchments"
            >
              <Layer
                id="catchment-fills"
                // beforeId="stations"
                type="fill"
                paint={{
                  'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.7,
                    0.5,
                  ],
                }}
              />
              <Layer
                id="catchment-labels"
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
          </MapGL>
        )}
      </div>
    );
  },
);

export default Map;
