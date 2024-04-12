import '../style/appLayout.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../UserInfoContext';

export default function VerifyUser() {
	const navigate = useNavigate();
	const {userProfile} = useUserInfo();
  
	useEffect(() => {
		if (userProfile?.auth0Id) {
			navigate('/profile');
		} 
	}, [userProfile, navigate]);

	return <div className='loading'>Loading...</div>;
}
