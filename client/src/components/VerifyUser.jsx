import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../UserInfoContext';

export default function VerifyUser() {
    const navigate = useNavigate();
    const { userProfile } = useUserInfo();

    useEffect(() => {
        if (userProfile?.auth0Id) {
            const lastPageURL = localStorage.getItem('lastPage') || '/';
            localStorage.removeItem('lastPage'); // Clear the last page from storage

            try {
                const url = new URL(lastPageURL);
                const path = url.pathname + url.search; // Combine the path and the search query
                navigate(path, { replace: true }); // Use navigate to avoid adding a new entry in the history stack
            } catch (e) {
                console.error('Invalid URL in lastPage:', lastPageURL);
                navigate('/', { replace: true }); // Fallback to home if URL is invalid
            }
        }
    }, [userProfile, navigate]);

    return <div className='loading'>Loading...</div>;
}
