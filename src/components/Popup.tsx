import { Popup } from 'react-map-gl';
import Typography from '@mui/material/Typography';

interface PopupProps {
  selectedStation: mapboxgl.MapboxGeoJSONFeature | null;
  setSelectedStation: React.Dispatch<
    React.SetStateAction<mapboxgl.MapboxGeoJSONFeature | null>
  >;
}

export default ({ selectedStation, setSelectedStation }: PopupProps) => {
  return (
    <Popup
      anchor="top"
      longitude={Number(
        selectedStation?.geometry.type === 'Point'
          ? selectedStation?.geometry.coordinates[0]
          : undefined,
      )}
      latitude={Number(
        selectedStation?.geometry.type === 'Point'
          ? selectedStation?.geometry.coordinates[1]
          : undefined,
      )}
      onClose={() => setSelectedStation(null)}
    >
      <Typography variant="h3" gutterBottom>
        {selectedStation?.properties?.name}
      </Typography>
      <Typography gutterBottom>
        Elevation: {selectedStation?.properties?.elevation}m
      </Typography>
      <Typography gutterBottom>
        ID: {selectedStation?.properties?.station_id}
      </Typography>
      <Typography sx={{ overflowWrap: 'break-word' }}>
        SID: {selectedStation?.properties?.station_sid}
      </Typography>
    </Popup>
  );
};
