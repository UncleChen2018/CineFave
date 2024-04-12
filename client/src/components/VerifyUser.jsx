import '../style/appLayout.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../UserInfoContext';

export default function VerifyUser() {
	const navigate = useNavigate();
	const {userProfile} = useUserInfo();
	//in this temporary component, we'll call the verify-user endpoint to check if the user exists in our database
	// useEffect(() => {
	// 	async function verifyUser() {
	// 		const user = await verifyAndUpdateUserProfile();
	// 		console.log(user);
	// 		console.log(userProfile);
	// 	}

	// 	if (accessToken) {
	// 		verifyUser();
	// 	}
	// }, [accessToken, verifyAndUpdateUserProfile]);

  
	useEffect(() => {
		if (userProfile?.auth0Id) {
      console.log(userProfile);
			navigate('/profile');
		} 
	}, [userProfile, navigate]);

	return <div className='loading'>Loading...</div>;
}
