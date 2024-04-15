// useToggleFavorite.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../AuthTokenContext';
import { useUserInfo } from '../UserInfoContext';
import { useAuth0 } from '@auth0/auth0-react';

export default function useToggleFavorite() {
	const { accessToken } = useAuthToken();
	const { favorites, setFavorites } = useUserInfo();
	const navigate = useNavigate();
	const { loginWithRedirect } = useAuth0();

	const handleLogin = () => {
		localStorage.setItem('lastPage', window.location.pathname);
		loginWithRedirect({
			redirectUri: `${window.location.origin}/verify-user`,
		});
	};

	const toggleFavorite = async (movie) => {
		if (!accessToken) {
			handleLogin();
			return;
		}

		const isFavorite = favorites.some((fav) => fav.movieId === movie.id);
		const url = `${process.env.REACT_APP_API_URL}/toggleFavorite/${movie.id}`;
		const method = 'POST';

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ movie }), // Send the entire movie object
			});

			if (!response.ok) {
				throw new Error(
					`Failed to toggle favorite status for movie with ID: ${movie.id}`
				);
			}

			let updatedFavorites;
			if (isFavorite) {
				updatedFavorites = favorites.filter((fav) => fav.movieId !== movie.id);
			} else {
				const newFavorite = {
					movieId: movie.id,
					createTime: new Date().toISOString(), // Use the current time as createTime
				};
				updatedFavorites = [...favorites, newFavorite];
			}

			setFavorites(updatedFavorites);
		} catch (error) {
			console.error('Error toggling favorite:', error);
			// Handle the error state appropriately, e.g., show an error message
		}
	};

	return { toggleFavorite };
}
