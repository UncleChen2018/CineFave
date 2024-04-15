import { useCallback, useContext } from 'react';
import { useAuthToken } from '../AuthTokenContext';

export const useDeleteReview = () => {
  const { accessToken } = useAuthToken();

  const deleteReview = useCallback(async (reviewId, onSuccess) => {
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const url = `${process.env.REACT_APP_API_URL}/reviews/${reviewId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      // Invoke the success callback
      onSuccess(reviewId);

    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [accessToken]);

  return deleteReview;
};
