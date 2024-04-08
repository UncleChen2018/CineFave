import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'Tilt Neon', cursive", // Use for headings
    body: "'Roboto', sans-serif"
  },
  // You can also customize other theme properties here
});

export default theme;
