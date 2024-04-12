import { useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useUserInfo } from "../UserInfoContext";

export default function useUpdateUserProfile() {
  const { accessToken } = useAuthToken();
  const { userProfile, setUserProfile } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function updateUserProfile(updatedProfile) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserProfile(data); // Update context with the new user profile data
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  return { updateUserProfile, isLoading, error };
}
