import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FaStar } from 'react-icons/fa';

import MovieDetailCard from './MovieDetailCard';
import ReviewList from './ReviewList';

import ReactMarkdown from 'react-markdown';
import {
	Box,
	Divider,
} from '@chakra-ui/react';

const reviews = [
	{
		author: 'Chris Sawin',
		author_details: {
			name: 'Chris Sawin',
			username: 'ChrisSawin',
			avatar_path: null,
			rating: 6,
		},
		content:
			'_Kung Fu Panda 4_ isn’t the best _Kung Fu Panda_ film, or even the best of the series’ three sequels. However, as a fourth film in a franchise, it’s a ton of fun.\r\n\r\nAnd though it’s action isn’t quite as entertaining as its predecessors and it’s unfortunate to see Awkwafina playing yet another thief (_Jumanji: The Next Level_ says hello), for the most part, _Kung Fu Panda 4_ happily skadooshes its way to animated greatness.\r\n\r\n**Full review:** https://bit.ly/KuFuPa4',
		created_at: '2024-03-13T13:23:41.755Z',
		id: '65f1a8ddfa4046012e1121b6',
		updated_at: '2024-03-13T13:23:41.909Z',
		url: 'https://www.themoviedb.org/review/65f1a8ddfa4046012e1121b6',
	},
	{
		author: 'CinemaSerf',
		author_details: {
			name: 'CinemaSerf',
			username: 'Geronimo1967',
			avatar_path: '/1kks3YnVkpyQxzw36CObFPvhL5f.jpg',
			rating: 6,
		},
		content:
			'This is probably my favourite of the franchised animated action-comedies, but I think we are now clearly running out of conceptual steam. With "Po" being told by "Master Shifu" that it is now time for him to move onwards and upwards - much to his chagrin - he must recruit a new dragon warrior so he can retreat to more cerebral pastimes. Luckily, though, the "Chameleon" has designs on obtaining all the powers from those now consigned to the nether realm and using the powers of Kung Fu to take over the world. "Po" has to be put his promotion on hold and along with his new-found, and useful, foxy friend "Zhen" try to thwart these heinous ambitions. Though there\'s plenty of action and self-deprecating dialogue the storyline really is too much of a recycled affair. Even the panda has been drawn into the multi-verse and to be frank, I\'m a bit bored with that theme now - especially as it\'s never really accompanied by much in the way of jeopardy. Yes, this is an entirely predicable story that, in this case, misses out on the characterisations of his pals from the "Furious Five". It\'s watchable and the story well paced; there\'s some fun to be had in the wobbly, mountain-top, tavern but I think I\'ve already forgotten most of it.',
		created_at: '2024-03-29T08:44:08.063Z',
		id: '66067f582faf4d0164c6af0a',
		updated_at: '2024-03-29T08:44:08.219Z',
		url: 'https://www.themoviedb.org/review/66067f582faf4d0164c6af0a',
	},
];

function MovieDetailPage() {
	const { id } = useParams();

	const [movie, setMovie] = useState(null); // State to hold the movie details

	useEffect(() => {
		const fetchMovieDetails = async () => {
			const baseUrl = process.env.REACT_APP_TMDB_BASE_URL;
			const apiKey = process.env.REACT_APP_TMDB_API_KEY;

			const endpoint = process.env.REACT_APP_TMDB_ENDPOINT_MOVIE_DETAILS;
			const url = `${baseUrl}${endpoint}/${id}?api_key=${apiKey}`; // Replace YOUR_API_KEY with your actual TMDB API key

			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setMovie(data);
			} catch (error) {
				console.error('Fetching movie details failed:', error);
			}
		};

		fetchMovieDetails();
	}, [id]); // The effect depends on the movie ID

	if (!movie) {
		return <Box>Loading...</Box>; // Loading state or a spinner can be placed here
	}

	return (
		<Box mt='4' p='2'>
			{/* Movie Info and Image */}
			<MovieDetailCard movie={movie} />
			{/* Divider */}
			<Divider my={10} />

			{/* Review List */}
			<ReviewList reviews={reviews} />
		</Box>
	);
}

export default MovieDetailPage;
