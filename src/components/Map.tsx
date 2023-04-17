import MapGL, { Layer, Source, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useForwardRef } from '../hooks/useForwardRef';
import { useClimateStations } from '../hooks/useClimateStations';
import { useCatchmentBoundaries } from '../hooks/useCatchmentBoundaries';
import { forwardRef } from 'react';

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

    const forwardedRef = useForwardRef<MapRef>(ref);

    const { stations, loading: stationsLoading } = useClimateStations();
    const { catchments, loading: catchmentsLoading } = useCatchmentBoundaries();

    const handleClickFeature = (e: mapboxgl.MapLayerMouseEvent) => {
      const features = forwardedRef?.current?.queryRenderedFeatures(e.point, {
        layers: ['catchment-fills', 'stations'],
      });
      console.log(features);
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

            <Source
              type="geojson"
              data={catchments}
              promoteId="uuid"
              id="catchments"
            >
              <Layer
                id="catchment-fills"
                beforeId="stations"
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
