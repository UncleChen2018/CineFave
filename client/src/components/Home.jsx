import "../style/home.css";

import MovieCard from "./MovieCard";
import MovieCarousel from "./MovieCarousel";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {  Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";


const movie = {
  title: 'example',
  releaseDate: '2012-02-02',
  imageUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
  rating: '3.',
  isLiked: false,
}

const movies = Array.from({ length: 10 }, () => ({ ...movie }));

// the home page should contain the 
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <Box p={{ base: 5, md: 20, lg: 30 }} mt={-5}>
      <Box mb={4}>
      <Heading as="h2" size="lg" py='5' sx={{
    fontSize: ['md', 'lg', 'xl', '2xl'], 
  }}>Trending</Heading>
      <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Today</Tab>
            <Tab>This Week</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Content for Today */}
              <MovieCarousel movies={movies} w={['120px','150px']}  />
            </TabPanel>
            <TabPanel>
              {/* Content for This Week */}
              <MovieCarousel movies={movies} w={['120px','150px']}  />
            </TabPanel>
          </TabPanels>
        </Tabs>
      
      </Box>
    </Box>
  );
}


