import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from 'react-router-dom';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { AuthTokenProvider } from './AuthTokenContext';
import { UserInfoProvider } from './UserInfoContext';

import { ChakraProvider, Box, Container } from '@chakra-ui/react';
import theme from './theme';

import NotFound from './components/NotFound';
import NotAuthorizedPage from './components/NotAuthorizedPage';
import Home from './components/Home';
import Header from './components/Header';

import MovieDetailPage from './components/MovieDetailPage';
import ProfilePage from './components/ProfilePage';
import AuthDebugger from './components/AuthDebugger';
import VerifyUser from './components/VerifyUser';
import EditProfilePage from './components/EditProfilePage';

import SearchPage from './components/SearchPage';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ['profile', 'email'];

const RequireAuth = () => {
	const { isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading...</div>; // Or some loading indicator
	}

	if (!isAuthenticated) {
		// Store the path the user is coming from
		localStorage.setItem('lastPage', window.location.pathname);
		// Redirect to the not-authorized page
		return <Navigate to='/not-authorized' replace />;
	}

	return <Outlet />;
};

root.render(
	<React.StrictMode>
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			authorizationParams={{
				redirect_uri: `${window.location.origin}/verify-user`,
				audience: process.env.REACT_APP_AUTH0_AUDIENCE,
				scope: requestedScopes.join(' '),
			}}
		>
			<AuthTokenProvider>
				<UserInfoProvider>
					<ChakraProvider theme={theme}>
						<BrowserRouter>
							<Box maxW='1280px' w='100%' mx='auto' px={0}>
								<Header />
								<Routes>
									<Route path='/' element={<Home />} />
									<Route path='/verify-user' element={<VerifyUser />} />
									<Route path='/movie/:id' element={<MovieDetailPage />} />
									<Route path='/search' element={<SearchPage />} />
									<Route path='/profile' element={<RequireAuth />}>
										<Route index element={<ProfilePage />} />
										<Route path='edit' element={<EditProfilePage />} />
										<Route path='auth_debugger' element={<AuthDebugger />} />
									</Route>
									<Route
										path='/not-authorized'
										element={<NotAuthorizedPage />}
									/>
									<Route path='*' element={<NotFound />} />
								</Routes>
							</Box>
						</BrowserRouter>
					</ChakraProvider>
				</UserInfoProvider>
			</AuthTokenProvider>
		</Auth0Provider>
	</React.StrictMode>
);
