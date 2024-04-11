import React from 'react';
import { Routes, Route, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {useAuth0 } from "@auth0/auth0-react";
import UserOverview from './UserOverview';
import UserReviews from './UserReviews';
import UserFavorites from './UserFavorites';

import useUserProfile from '../hooks/useUserInfo';

import {
	Box,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Text,
	VStack,
	SimpleGrid,
} from '@chakra-ui/react';

// Assuming these mock data are defined elsewhere in your file
const userProfile = {
	bio: 'A movie enthusiast with a penchant for the classics.',
};

const userReviews = [
	{
		movieTitle: 'Inception',
		reviewText: 'A masterpiece that bends the fabric of reality.',
	},
	// More reviews...
];

const favoriteMovies = [
	{ title: 'Interstellar', year: 2014 },
	// More favorite movies...
];

function ProfilePage() {
  const { user } = useAuth0();
  const [userProfile, setUserProfile] = useUserProfile();
  const userFullInfo = { ...user, ...userProfile };
	return (
		<Box padding='4'>
			<Tabs isFitted variant='enclosed'>
				<TabList mb='1em'>
					<Tab>Overview</Tab>
					<Tab>Reviews</Tab>
					<Tab>Favorites</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<UserOverview userInfo={userFullInfo}/>
					</TabPanel>
					<TabPanel>
						<UserReviews reviews={userReviews}/>
					</TabPanel>
					<TabPanel>
						<UserFavorites favorites={favoriteMovies}/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}

export default ProfilePage;
