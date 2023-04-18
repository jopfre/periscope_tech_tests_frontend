import Pin from './Pin';
import { Marker } from 'react-map-gl';

interface MarkerProps {
  feature: mapboxgl.MapboxGeoJSONFeature | null;
  setSelectedStation: React.Dispatch<
    React.SetStateAction<mapboxgl.MapboxGeoJSONFeature | null>
  >;
}

export default ({ feature, setSelectedStation }: MarkerProps) => {
  return (
    <Marker
      longitude={
        feature?.geometry.type === 'Point'
          ? feature?.geometry.coordinates[0]
          : undefined
      }
      latitude={
        feature?.geometry.type === 'Point'
          ? feature?.geometry.coordinates[1]
          : undefined
      }
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        setSelectedStation(feature);
        console.log('Clicked on station', feature?.properties?.station_sid);
      }}
    >
      <Pin />
    </Marker>
  );
};
