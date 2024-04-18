import React, { useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthTokenContext = React.createContext();

const requestedScopes = ['profile', 'email'];

function AuthTokenProvider({ children }) {
	const {
		getAccessTokenSilently,
		isAuthenticated,
		isLoading: auth0Loading,
	} = useAuth0();
	const [accessToken, setAccessToken] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getAccessToken = async () => {
			try {
				// get access token silently from Auth0, which will be stored in the context
				const token = await getAccessTokenSilently({
					authorizationParams: {
						audience: process.env.REACT_APP_AUTH0_AUDIENCE,
						scope: requestedScopes.join(' '),
					},
				});
				setAccessToken(token);
			} catch (err) {
				console.error('Error fetching access token:', err);
				setError(err.message); // Store error message
			} finally {
				setIsLoading(false);
			}
		};

		// if auth0 has finished loading and the user is authenticated, get the access token
		if (!auth0Loading) {
			if (isAuthenticated) {
				getAccessToken();
			} else {
				setIsLoading(false);
			}
		}
	}, [isAuthenticated, auth0Loading]);

	const value = { accessToken, isAuthenticated, isLoading, error };
	return (
		<AuthTokenContext.Provider value={value}>
			{children}
		</AuthTokenContext.Provider>
	);
}

const useAuthToken = () => useContext(AuthTokenContext);

export { useAuthToken, AuthTokenProvider };
