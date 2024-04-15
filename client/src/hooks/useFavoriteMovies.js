import { useState } from 'react';
import { useAuthToken } from '../AuthTokenContext';

export function useFetchFavorites() {
	const { accessToken } = useAuthToken();
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	async function fetchFavorites() {
		if (!accessToken) {
			setError('Access token is missing');
			return;
		}

		setIsLoading(true);
		const url = `${process.env.REACT_APP_API_URL}/favorites`;
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch favorites');
			}
			const data = await response.json();
			setFavorites(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	return { favorites, fetchFavorites, isLoading, error };
}

export function useFetchFavoritesDetails() {
	const { accessToken } = useAuthToken();
	const [favoritesDetails, setFavoritesDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	async function fetchFavoritesDetails() {
		if (!accessToken) {
			setError('Access token is missing');
			return;
		}

		setIsLoading(true);
		const url = `${process.env.REACT_APP_API_URL}/favorites/details`;
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch favorites');
			}
			const data = await response.json();
			const movies = data.forEach((item) => {
				// Add the isLiked property to the favMovie object
				item.favMovie.isLiked = true;

				// Convert releaseDate to a Date object
				const releaseDate = new Date(item.favMovie.releaseDate);
				// Format the date as "YYYY-MM-DD"
				const formattedReleaseDate = releaseDate.toISOString().slice(0, 10);
				// Update the releaseDate in the object
				item.favMovie.releaseDate = formattedReleaseDate;
			});
			setFavoritesDetails(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	return { favoritesDetails, fetchFavoritesDetails, isLoading, error };
}
