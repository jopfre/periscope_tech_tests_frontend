import { useState } from 'react';
import { useCatchmentBoundaries } from '../hooks/useCatchmentBoundaries';

interface FormProps {
  selectedStation: mapboxgl.MapboxGeoJSONFeature | null;
}

interface CatchmentStation {
  catchmentUuid: string;
  stationSid: string;
  trainingDateRange?: string;
  validationDateRange?: string;
}

const Form: React.FC<FormProps> = ({ selectedStation }) => {
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
    <div className="Form">
      <form onSubmit={handleSubmit}>
        <h2>Each catchment needs to be linked to a station</h2>
        {selectedStation && (
          <>
            <strong>Selected Station</strong> {selectedStation.properties?.name}
            <br />
            sid:
            {selectedStation.properties?.station_sid}
          </>
        )}
        {catchmentsLoading ? (
          'Loading'
        ) : (
          <ul>
            {catchments &&
              catchments.features.map((catchment: any, i: number) => (
                <li key={catchment.properties.uuid}>
                  {catchment.properties.name}
                  <input
                    type="text"
                    placeholder="Station Sid"
                    onChange={(e) =>
                      handleChangeField(
                        catchment.properties.uuid,
                        e.target.value,
                      )
                    }
                    required
                  />
                </li>
              ))}
          </ul>
        )}

        <input type="submit" />
      </form>
    </div>
  );
};

export default Form;
