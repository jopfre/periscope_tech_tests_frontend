import { Popup, MapRef } from 'react-map-gl';
import Typography from '@mui/material/Typography';
import { useEffect, ForwardedRef, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { CatchmentStation } from '../App';

interface PopupProps {
  mapRef: ForwardedRef<MapRef> | null;
  selectedStation: mapboxgl.MapboxGeoJSONFeature | null;
  setSelectedStation: React.Dispatch<
    React.SetStateAction<mapboxgl.MapboxGeoJSONFeature | null>
  >;
  catchmentStations: CatchmentStation[];
  setCatchmentStations: React.Dispatch<
    React.SetStateAction<CatchmentStation[]>
  >;
}

const PeriscopePopup = ({
  selectedStation,
  setSelectedStation,
  catchmentStations,
  setCatchmentStations,
  mapRef,
}: PopupProps) => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (selectedStation)
      setChecked(
        catchmentStations.some(
          (el) => el.stationSid === selectedStation.properties?.station_sid,
        ),
      );
  }, [catchmentStations, selectedStation]);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    catchmentUuid: string | undefined,
  ) => {
    setChecked(event.target.checked);
    if (catchmentUuid) {
      if (event.target.checked) {
        setCatchmentStations([
          ...catchmentStations.filter(
            (cs) => cs.catchmentUuid !== catchmentUuid,
          ),
          {
            catchmentUuid,
            stationSid: selectedStation?.properties?.station_sid,
          },
        ]);
      } else {
        setCatchmentStations([
          ...catchmentStations.filter(
            (cs) => cs.catchmentUuid !== catchmentUuid,
          ),
          {
            catchmentUuid,
            stationSid: '',
          },
        ]);
      }
    }
  };
  if (
    mapRef != null &&
    typeof mapRef !== 'function' &&
    selectedStation?.geometry.type === 'Point'
  ) {
    const catchment = mapRef.current?.queryRenderedFeatures(
      //convert latlong to point for mapbox
      mapRef.current?.project([
        selectedStation?.geometry.coordinates[0],
        selectedStation?.geometry.coordinates[1],
      ]),
      {
        layers: ['catchment-fills'],
      },
    );

    return (
      <Popup
        anchor="top"
        longitude={Number(selectedStation?.geometry.coordinates[0])}
        latitude={Number(selectedStation?.geometry.coordinates[1])}
        onClose={() => setSelectedStation(null)}
      >
        <Typography variant="h3" gutterBottom>
          {selectedStation?.properties?.name}
        </Typography>
        {
          <Typography variant="body2" gutterBottom>
            Catchment:{' '}
            {catchment && catchment[0]?.id ? (
              <>
                {catchment[0].properties?.name}
                <br /> Assigned{' '}
                <Checkbox
                  checked={checked}
                  onChange={(event) =>
                    handleChange(event, catchment[0].id?.toString())
                  }
                />
              </>
            ) : (
              'None'
            )}
          </Typography>
        }
        <Typography variant="body2" gutterBottom>
          Elevation: {selectedStation?.properties?.elevation}m
        </Typography>
        <Typography variant="body2" gutterBottom>
          ID: {selectedStation?.properties?.station_id}
        </Typography>
        <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
          SID: {selectedStation?.properties?.station_sid}
        </Typography>
      </Popup>
    );
  }
  return <></>;
};

export default PeriscopePopup;
