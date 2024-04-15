import { useState, useCallback } from 'react';
import { useAuthToken } from '../AuthTokenContext';

export default function useAddReview() {
  const { accessToken } = useAuthToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const addReview = useCallback(async (movieId, reviewData) => {
    if (!accessToken) {
      setError('Access token is missing');
      return;
    }

    if (!reviewData.content || reviewData.content.trim() === '') {
      setError('Review content is required');
      return;
    }

    setIsSubmitting(true);
    const url = `${process.env.REACT_APP_API_URL}/reviews/${movieId}`; // Adjust the URL to your API's endpoint

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: reviewData.title?.trim() || '',
          content: reviewData.content,
          rating: reviewData.rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Optionally, handle the response data if needed
      const data = await response.json();
      return data; // Return the new review data

    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken]);

  return { addReview, isSubmitting, error };
}
