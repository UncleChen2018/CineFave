import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthToken } from './AuthTokenContext';
import { useFetchFavorites } from './hooks/useFavoriteMovies'; // Ensure correct path

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
    const { isAuthenticated, accessToken } = useAuthToken();
    const [userProfile, setUserProfile] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch user profile
    const fetchUserProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch user profile.');
            const data = await response.json();
            setUserProfile(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch favorites
    const fetchFavorites = async () => {
        if (!accessToken) {
            setError('Access token is missing');
            return;
        }
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
    };

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchUserProfile();
            fetchFavorites();
        }
    }, [isAuthenticated, accessToken]);

    return (
        <UserInfoContext.Provider
            value={{ userProfile, setUserProfile, favorites, setFavorites, fetchFavorites, isLoading, error }}
        >
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => useContext(UserInfoContext);
