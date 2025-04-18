import { createTheme } from '@mui/material/styles';

// Google Material color palette
const googleColors = {
  primary: {
    main: '#4285F4', // Google Blue
    contrastText: '#fff',
  },
  secondary: {
    main: '#EA4335', // Google Red
    contrastText: '#fff',
  },
  success: {
    main: '#34A853', // Google Green
    contrastText: '#fff',
  },
  warning: {
    main: '#FBBC05', // Google Yellow
    contrastText: '#fff',
  },
  background: {
    default: '#fff',
    paper: '#f5f5f5',
  },
};

const theme = createTheme({
  palette: googleColors,
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
