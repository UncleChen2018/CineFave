import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserOverview from './UserOverview';
import UserReviews from './UserReviews';
import UserFavorites from './UserFavorites';

import { useUserInfo } from '../UserInfoContext'; // Adjust the import path as needed

import {
	Text,
	Box,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from '@chakra-ui/react';

function ProfilePage({ defaultIndex }) {
	const { userProfile, setUserProfile, favorites } = useUserInfo();
	const [hasFetched, setHasFetched] = useState(false);

	const navigate = useNavigate();
	const [tabIndex, setTabIndex] = useState(defaultIndex || 0);

	const handleTabsChange = (index) => {
		setTabIndex(index);
		switch (index) {
			case 0:
				navigate('/profile');
				break;
			case 1:
				navigate('/profile/favorites');
				break;
			case 2:
				navigate('/profile/reviews');
				break;

			default:
				navigate('/profile');
		}
	};

	const location = useLocation();

	useEffect(() => {
		// This effect sets the active tab based on the current route
		if (location.pathname.includes('/overview')) {
			setTabIndex(0);
		} else if (location.pathname.includes('/favorites')) {
			setTabIndex(1);
		} else if (location.pathname.includes('/reviews')) {
			setTabIndex(2);
		} else {
			setTabIndex(defaultIndex || 0);
		}
	}, [location, defaultIndex]);

	return (
		<Box padding='4'>
			{/* <Text fontSize='lg' fontWeight='bold' whiteSpace='pre-wrap'>
				{JSON.stringify(favorites, null, 2)}
				{JSON.stringify(userProfile, null, 2)}
			</Text> */}
			<Tabs
				isFitted
				variant='enclosed'
				index={tabIndex}
				onChange={handleTabsChange}
			>
				<TabList mb='1em'>
					<Tab>Overview</Tab>
					<Tab>Favorites</Tab>
					<Tab>Reviews</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<UserOverview />
					</TabPanel>
					<TabPanel>
						<UserFavorites />
					</TabPanel>
					<TabPanel>
						<UserReviews toFetch={[hasFetched, setHasFetched]} />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}

export default ProfilePage;
