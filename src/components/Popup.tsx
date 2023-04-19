import { Popup, MapRef } from 'react-map-gl';
import Typography from '@mui/material/Typography';
import { ForwardedRef, useState } from 'react';
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

export default ({
  selectedStation,
  setSelectedStation,
  catchmentStations,
  setCatchmentStations,
  mapRef,
}: PopupProps) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    catchmentUuid: string | undefined,
  ) => {
    setChecked(event.target.checked);

    // console.log(selectedStation?.properties?.station_sid, catchmentUuid);
    // setCatchmentStations()
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
          <Typography gutterBottom>
            Catchment:{' '}
            {catchment && catchment[0]?.id ? (
              <>
                {catchment[0].properties?.name} Assigned{' '}
                {console.log(selectedStation)}
                <Checkbox
                  checked={catchmentStations.some(
                    (el) =>
                      el.stationSid === selectedStation.properties?.station_sid,
                  )}
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
  }
  return <></>;
};
