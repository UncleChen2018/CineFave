import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import MovieCarousel from './MovieCarousel';
import { useUserInfo } from '../UserInfoContext';

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const { favorites } = useUserInfo(); // Assuming this is structured as [{ movieId, createTime }, ...]
    const [moviesTD, setMoviesTD] = useState([]);
    const [moviesTW, setMoviesTW] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const favoriteMovieIds = favorites.map(favorite => favorite.movieId); // Extract movie IDs from favorites

        const fetchMovies = async (endpoint) => {
            try {
                const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
                const apiKey = process.env.REACT_APP_TMDB_API_KEY;
                const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Something went wrong with the movie fetch.');
                }
                const data = await response.json();
                return data.results.map(movie => ({
                    ...movie,
                    id: movie.id,
                    title: movie.title,
                    releaseDate: movie.release_date,
                    rating: movie.vote_average,
                    imageUrl: `${process.env.REACT_APP_TMDB_IMG_HOST_URL}${process.env.REACT_APP_TMDB_IMAGE_SIZE}${movie.poster_path}`,
                    isLiked: favoriteMovieIds.includes(movie.id), // Check if the movie ID is in the favorites
                }));
            } catch (error) {
                throw error;
            }
        };

        const loadMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let moviesTD = await fetchMovies(process.env.REACT_APP_TMDB_ENDPOINT_TRENDING_DAY);
                let moviesTW = await fetchMovies(process.env.REACT_APP_TMDB_ENDPOINT_RENDING_WEEK);

                setMoviesTD(moviesTD);
                setMoviesTW(moviesTW);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
				// no matter if the user is authenticated or not, we want to load the movies
        loadMovies();
    }, [isAuthenticated, favorites]); // Re-run the effect if authentication status or favorites change

    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    if (error) {
        return <Box>Error: {error}</Box>;
    }

    return (
        <Box p={{ base: 5, md: 20, lg: 30 }} mt={-5}>
            <Box mb={4}>
                <Heading as='h2' size='lg' py='5' sx={{ fontSize: ['md', 'lg', 'xl', '2xl'] }}>
                    Trending
                </Heading>
                <Tabs isFitted variant='enclosed'>
                    <TabList mb='1em'>
                        <Tab fontSize={['sm', 'md', 'lg', 'lg']} fontWeight='semibold'>
                            Today
                        </Tab>
                        <Tab fontSize={['sm', 'md', 'lg', 'lg']} fontWeight='semibold'>
                            This Week
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <MovieCarousel movies={moviesTD} w={['120px', '150px']} />
                        </TabPanel>
                        <TabPanel>
                            <MovieCarousel movies={moviesTW} w={['120px', '150px']} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
}
