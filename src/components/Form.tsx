import { useState, RefObject } from 'react';
import { useCatchmentBoundaries } from '../hooks/useCatchmentBoundaries';

import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { MapRef } from 'react-map-gl';

interface FormProps {
  selectedStation: mapboxgl.MapboxGeoJSONFeature | null;
  mapRef: RefObject<MapRef>;
}

interface CatchmentStation {
  catchmentUuid: string;
  stationSid: string;
  trainingDateRange?: string;
  validationDateRange?: string;
}

const Form: React.FC<FormProps> = ({ selectedStation, mapRef }) => {
  const { catchments, loading: catchmentsLoading } = useCatchmentBoundaries();
  const [catchmentStations, setCatchmentStations] = useState<
    CatchmentStation[]
  >([]);

  const handleChangeField = (catchmentUuid: string, stationSid: string) => {
    setCatchmentStations([
      ...catchmentStations.filter((cs) => cs.catchmentUuid !== catchmentUuid),
      { catchmentUuid, stationSid },
    ]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit', catchmentStations);
  };

  return (
    <Container>
      <Typography variant="h2" gutterBottom mt={6} mb={2}>
        Assign stations
      </Typography>
      {/*selectedStation && (
        <>
          <strong>Selected Station</strong> {selectedStation.properties?.name}
          <br />
          sid:
          {selectedStation.properties?.station_sid}
        </>
      )*/}

      {catchmentsLoading ? (
        <Stack spacing={2}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Stack>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {catchments &&
              catchments.features.map((catchment: any, i: number) => (
                <TextField
                  key={catchment.properties.uuid}
                  label={catchment.properties.name}
                  placeholder="Station Sid"
                  onChange={(e) =>
                    handleChangeField(catchment.properties.uuid, e.target.value)
                  }
                  onMouseEnter={() => {
                    mapRef.current?.setFeatureState(
                      {
                        source: 'catchments',
                        id: catchment.properties.uuid,
                      },
                      {
                        hover: true,
                      },
                    );
                  }}
                  onMouseLeave={() => {
                    mapRef.current?.setFeatureState(
                      {
                        source: 'catchments',
                        id: catchment.properties.uuid,
                      },
                      {
                        hover: false,
                      },
                    );
                  }}
                  variant="outlined"
                  required
                  fullWidth
                />
              ))}
            <div>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </Stack>
        </form>
      )}
    </Container>
  );
};

export default Form;
