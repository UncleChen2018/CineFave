import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

// this is a custom hook that fetches the todos items from the API
// custom hooks are a way to share logic between components
export default function useUserProfile() {
  const [userProfile, setUserProfile] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getUserInfoFromApi() {
      // fetch the user profile from the API, passing the access token in the Authorization header
      const data = await fetch(`${process.env.REACT_APP_API_URL}/userInfo`, {
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
