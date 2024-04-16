import React,{useEffect} from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useUserInfo } from '../UserInfoContext';
import { useFetchUserReviews } from '../hooks/useFetchReviews';
import ReviewList from './ReviewList';

import { useDeleteReview } from '../hooks/useDeleteReview'


const UserReviews = () => {
  const { userInfo } = useUserInfo();
  const { fetchReviews, reviews, setReviews } = useFetchUserReviews();

  useEffect(() => {
    fetchReviews();
  }, [userInfo]);

  const deleteReview = useDeleteReview();
  const handleDeleteReview = (reviewId) => {
		deleteReview(reviewId, () => {
			// Update the local state to remove the deleted review
			setReviews(reviews.filter((review) => review.id !== reviewId));
		});
	};


	return (
		<ReviewList title='Your Reviews' reviews={reviews} handleDelete={handleDeleteReview} 
    handleEdit={()=>{fetchReviews()}}/>
	);
};

export default UserReviews;
