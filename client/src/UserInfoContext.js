import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthToken } from './AuthTokenContext'; // Ensure correct path

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
	const { isAuthenticated, accessToken } = useAuthToken();
	const [userProfile, setUserProfile] = useState(null);

	const verifyAndUpdateUserProfile = async () => {
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
		if (!response.ok) {
			console.error('Failed to verify user profile.');
			setUserProfile(null);
			return null;
		}
		const userData = await response.json();
		if (!userData) {
			console.error('Failed to verify user profile.');
			setUserProfile(null);
			return null;
		}
		setUserProfile(userData); // Assuming response JSON has user profile data
		console.log(userData);
		return userData; // Return userData to check if verification was successful
	};

	// here, we'll post the auth0Id and get the user profile from the resource server
	useEffect(() => {
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
			} catch (error) {
				console.error('Error fetching user profile:', error);
				setUserProfile(null);
			}
		};
		// only fetch the user profile if the user is authenticated and has an access token
		if (isAuthenticated && accessToken) fetchUserProfile();
	}, [isAuthenticated, accessToken]);

	return (
		<UserInfoContext.Provider
			value={{ userProfile, setUserProfile, verifyAndUpdateUserProfile }}
		>
			{children}
		</UserInfoContext.Provider>
	);
};

export const useUserInfo = () => useContext(UserInfoContext);
