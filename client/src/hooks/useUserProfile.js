import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

// here, get the user profile stored in the localhost from the API
// custom hooks are a way to share logic between components
export default function useUserProfile() {
  const [userProfile, setUserProfile] = useState([]);
  const { accessToken } = useAuthToken();

  //when the accessToken changes, fetch the user profile from the API
  useEffect(() => {
    async function getUserInfoFromApi() {
      // fetch the user profile from the API, passing the access token in the Authorization header
      const data = await fetch(`${process.env.REACT_APP_API_URL}/userProfile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userData = await data.json();

      setUserProfile(userData);
    }

    if (accessToken) {
      getUserInfoFromApi();
    }
  }, [accessToken]);

  return [userProfile, setUserProfile];
}
