// useUpdateUserProfile.js

import { useState, useCallback } from "react";
import { useAuthToken } from "../AuthTokenContext";

export default function useUpdateUserProfile() {
  const { accessToken } = useAuthToken();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUserProfile = useCallback(async (updatedProfile) => {
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

      const updatedData = await response.json();
      // Assuming you might want to do something with the updated user data, like displaying a success message or logging.
      console.log('User successfully updated:', updatedData);
    } catch (error) {
      console.error('Updating user profile failed:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return { updateUserProfile, isLoading, error };
}
