import { useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';

import Form from './components/Form';
import Map from './components/Map';

import HurmeBold from './fonts/HurmeGeometricSans3-Bold.3eb395d8.woff2';
import DMSans from './fonts/DMSans-Regular.451a3489.woff2';
import DMSansBold from './fonts/DMSans-Bold.318e4ab1.woff2';
// import HurmeSemiBoldWoff2 from './fonts/HurmeGeometricSans3 SemiBold.3eb395d8.woff2';

function App() {
  const [selectedStation, setSelectedStation] =
    useState<null | mapboxgl.MapboxGeoJSONFeature>(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#262d4c',
      },
    },
    typography: {
      fontFamily: 'DMSans, sans-serif',
      body1: {
        fontSize: '1.3rem',
      },
      h2: {
        fontFamily: 'HurmeBold, sans-serif',
        fontSize: '1.5rem',
      },
      button: {
        fontSize: '1rem',
        fontFamily: 'DMSansBold',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'HurmeBold';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(${HurmeBold}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'DMSans';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(${DMSans}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'DMSansBold';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: url(${DMSansBold}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid
        container
        sx={{
          fontFamily: 'HurmeBoldWoff2',
        }}
      >
        <Grid item xs={12} md={4}>
          <Form selectedStation={selectedStation} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
