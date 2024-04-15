import { useState, useCallback, useContext } from 'react';
import { useAuthToken } from '../AuthTokenContext';
import { useUserInfo } from '../UserInfoContext'; // Assuming you have a UserContext that provides user information

export function useFetchMovieReviews() {
  const { accessToken } = useAuthToken();
  const { userProfile } = useUserInfo(); // Assuming user context provides the current user's info
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async (movieId) => {


    setIsLoading(true);

    const url = `${process.env.REACT_APP_API_URL}/movies/${movieId}/reviews`;

    try {
      const response = await fetch(url, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reviews');
      }

      const reviewsFromDb = await response.json();
      
      // Transform the reviews to match the expected format and add isAuthor flag
      const transformedReviews = reviewsFromDb.map((dbReview) => ({
        ...dbReview,
        author: dbReview.user.nickname || 'Anonymous',
        author_details: {
          name: dbReview.user.name || '',
          username: dbReview.user.name || 'Anonymous',
          avatar_path: dbReview.user.picture || null,
          rating: dbReview.rating? parseFloat(dbReview.rating)*10 : null,
        },
        created_at: dbReview.createTime,
        updated_at: dbReview.updateTime,
        
        isAuthor: userProfile && userProfile.id == dbReview.userId, // Check if the current user is the author
      }));

      setReviews(transformedReviews);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  return { fetchReviews, isLoading, reviews, setReviews, error };
}





