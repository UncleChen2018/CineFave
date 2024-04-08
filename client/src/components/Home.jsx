import "../style/home.css";

import React, { useEffect, useState } from "react";
import MovieCarousel from "./MovieCarousel";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {  Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";


// const movie = {
//   title: 'example',
//   releaseDate: '2012-02-02',
//   imageUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
//   rating: '3.',
//   isLiked: false,
// }

// const movies = Array.from({ length: 10 }, () => ({ ...movie }));

// the home page should contain the 
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  // fetch movies from the api
  const [movies, setMovies] = useState([]); // State to hold movie data
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(null); // State to hold any errors

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true); // Begin loading
      setError(null); // Reset errors

      try {
        // Replace 'your-api-endpoint' with the actual endpoint
        const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
        const apiKey = process.env.REACT_APP_TMDB_API_KEY;
        const trendingDay = process.env.REACT_APP_TMDB_ENDPOINT_TRENDING_DAY;
        const trendingWeek = process.env.REACT_APP_TMDB_ENDPOINT_RENDING_WEEK;  
        const urlTrendingDay = `${baseUrl}${trendingDay}?api_key=${apiKey}`;  
        
        const response = await fetch(urlTrendingDay);
        
        
        if (!response.ok) {
          throw new Error('Something went wrong!'); // Throw an error if the response is not ok
        }

        const data = await response.json(); // Parse JSON data from the response
        // Map the results to a more friendly format
        const updatedMovies = data.results.map((movie) => ({
          ...movie,
          imageUrl: `${process.env.REACT_APP_TMDB_IMG_HOST_URL}${process.env.REACT_APP_TMDB_IMAGE_SIZE}${movie.poster_path}`,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          title: movie.title,

        }));
        //setMovies(updatedMovies);

        console.log(updatedMovies);
        setMovies(updatedMovies)
        
      } catch (error) {
        setError(error.message); // Catch any errors and set an error message in state
      } finally {
        setIsLoading(false); // Finish loading regardless of success or error
      }
    };

    fetchMovies(); // Execute the asynchronous function
    console.log("movies",movies);
  }, []); // Empty dependency array means this effect runs once on mount




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


