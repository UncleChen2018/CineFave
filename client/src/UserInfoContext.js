import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useUserProfile from './hooks/useUserProfile'; // Adjust the path as needed

const UserInfoContext = createContext(null);

export const useUserInfo = () => useContext(UserInfoContext);

export const UserInfoProvider = ({ children }) => {
  const { user } = useAuth0();  // this is the user object from Auth0
  const [userProfile, setUserProfile] = useUserProfile(); // this is the user profile from your API
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (user && userProfile) {
      setUserInfo({ ...user, ...userProfile });
    }
  }, [user, userProfile]);

  return (
    <UserInfoContext.Provider value={[ userInfo, setUserInfo ]}>
      {children}
    </UserInfoContext.Provider>
  );
};
