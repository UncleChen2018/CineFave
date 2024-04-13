import { useState, useContext } from 'react';
import { useAuthToken } from '../AuthTokenContext';

// Hook to fetch all favorite movies
export function useFetchFavorites() {
    const { accessToken } = useAuthToken();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchFavorites() {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch favorites');
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

// Hook to check favorites status for a list of movies
export function useFavoritesStatus() {
    const { accessToken } = useAuthToken();
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function getFavoritesStatus(movieIds) {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/favoritesStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ movieIds }),
            });
            if (!response.ok) throw new Error('Failed to get favorites status');
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { status, getFavoritesStatus, isLoading, error };
}

// Similar structure can be followed for `useAddFavorite`, `useRemoveFavorite`, and `useToggleFavorite`

