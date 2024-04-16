import React,{useEffect,useState} from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { useUserInfo } from '../UserInfoContext';
import { useFetchUserReviews } from '../hooks/useFetchReviews';
import ReviewList from './ReviewList';

import { useDeleteReview } from '../hooks/useDeleteReview'


const UserReviews = ({isActive}) => {
  const { userInfo } = useUserInfo();
  const { fetchReviews, reviews, setReviews } = useFetchUserReviews();
  const [hasFetched, setHasFetched]=useState(false);
  useEffect(() => {
    if (!hasFetched && isActive) {
      fetchReviews();
      setHasFetched(true);
    } 
    return () => {
      setHasFetched(false);
    }; 
  }, [fetchReviews, isActive]);

  const deleteReview = useDeleteReview();
  const handleDeleteReview = (reviewId) => {
		deleteReview(reviewId, () => {
			// Update the local state to remove the deleted review
			setReviews(reviews.filter((review) => review.id !== reviewId));
		});
	};


	return (
    <>
    {/* <Text fontSize='lg' fontWeight='bold'>
      {JSON.stringify(reviews, null, 2)}
    </Text> */}
		<ReviewList title='Your Reviews' reviews={reviews} handleDelete={handleDeleteReview} 
    handleEdit={()=>{fetchReviews()}}/>
    </>
	);
};

export default UserReviews;
