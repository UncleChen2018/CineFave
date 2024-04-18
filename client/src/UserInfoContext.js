import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthToken } from './AuthTokenContext';

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
	const {
		isAuthenticated,
		accessToken,
		isLoading: isTokenLoading,
	} = useAuthToken();

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);


	const [userProfile, setUserProfile] = useState(null);

	const [favorites, setFavorites] = useState([]);
	// Function to fetch user profile
	const fetchUserProfile = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/verify-user`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			if (!response.ok) throw new Error('Failed to fetch user profile.');
			const data = await response.json();
			setUserProfile(data);
			return data;
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	};

	// Function to fetch favorites
	const fetchFavorites = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/favorites`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			if (!response.ok) throw new Error('Failed to fetch favorites');
			const data = await response.json();
			setFavorites(data);
		} catch (error) {
			console.error('Error fetching favorites:', error);
		}
	};

	// if not authenticated, clear the session data
	const clearSessionData = () => {
		localStorage.removeItem('userProfile');
		localStorage.removeItem('favorites');
		setUserProfile(null);
		setFavorites([]);
	};

	// useEffect(() => {
	// 	console.log('isAuthenticated:', isAuthenticated);
	// 	console.log('isTokenLoading:', isTokenLoading);
	// 	console.log('accessToken:', accessToken);
	// 	console.log('isLoading:', isLoading);
	// 	console.log('userProfile:', JSON.stringify(userProfile));
	// 	console.log('favorites:', JSON.stringify(favorites));

	// 	// if (!isAuthenticated) {
	// 	// 	clearSessionData();
	// 	// }
	// }, [
	// 	isAuthenticated,
	// 	isTokenLoading,
	// 	accessToken,
	// 	isLoading,
	// 	userProfile,
	// 	favorites,
	// ]);

	useEffect(() => {
		const initializeUserInfo = async () => {
			try {
				const userProfile = await fetchUserProfile();
				if (userProfile) {
					await fetchFavorites();
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
				setError(error); // Set error state
			} finally {
				setIsLoading(false); // Set loading false only after all operations are complete
			}
		};

		if (!isTokenLoading) {
			if (accessToken) {
				initializeUserInfo();
			} else {
				setIsLoading(false);
			}
		}
	}, [accessToken, isTokenLoading]);


	if (isLoading) {
		return <div>Loading...</div>; // Or some loading indicator
	}

	return (
		<UserInfoContext.Provider
			value={{
				userProfile,
				setUserProfile,
				favorites,
				setFavorites,
				fetchFavorites,
				isLoading,
				error,
			}}
		>
			{children}
		</UserInfoContext.Provider>
	);
};

export const useUserInfo = () => useContext(UserInfoContext);
