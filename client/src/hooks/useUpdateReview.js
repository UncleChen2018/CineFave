import { useCallback, useContext } from 'react';
import { useAuthToken } from '../AuthTokenContext';

export const useUpdateReview = () => {
  const { accessToken } = useAuthToken();

  const updateReview = useCallback(async (reviewId, updatedReviewData) => {
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const url = `${process.env.REACT_APP_API_URL}/reviews/${reviewId}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedReviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      const updatedReview = await response.json();
      return updatedReview; // Return the updated review data

  
    

    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [accessToken]);

  return {updateReview};
};
