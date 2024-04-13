import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../UserInfoContext';

export default function VerifyUser() {
  const navigate = useNavigate();
  const { userProfile } = useUserInfo();

  useEffect(() => {
    if (userProfile?.auth0Id) {
      const lastPage = localStorage.getItem('lastPage') || '/profile'; // default to '/profile' if not found
      navigate(lastPage);
      localStorage.removeItem('lastPage'); // Clear the last page from storage after navigating
    }
  }, [userProfile, navigate]);

  return <div className='loading'>Loading...</div>;
}
