import React,{useContext} from 'react';
import UserOverview from './UserOverview';
import UserReviews from './UserReviews';
import UserFavorites from './UserFavorites';

import { useUserInfo } from '../UserInfoContext'; // Adjust the import path as needed




import {
	Box,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel
} from '@chakra-ui/react';



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
	const {userProfile, setUserProfile} = useUserInfo();
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
						<UserOverview userInfo={userProfile}/>
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
