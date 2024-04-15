import React,{useEffect} from 'react';
import { Wrap, WrapItem, Box, Text } from '@chakra-ui/react';
import MovieCard from './MovieCard';
import { useUserInfo } from '../UserInfoContext';
import {useFetchFavoritesDetails} from '../hooks/useFavoriteMovies';
import useToggleFavorite from '../hooks/useToggleFavorite';

const UserFavorites = () => {  

  const {favoritesDetails, fetchFavoritesDetails} = useFetchFavoritesDetails();
  const {favorites} = useUserInfo();

  useEffect(() => {
    fetchFavoritesDetails();
  }, [favorites]);

  const { toggleFavorite } = useToggleFavorite();

	const handleFavoriteClick = async (movie) => {
		await toggleFavorite(movie);
	};


  return	<Wrap spacing='20px'>
      <Text fontSize='lg' fontWeight='bold'>
            {JSON.stringify(favoritesDetails, null, 2)}
          </Text>
		{favoritesDetails.map((item, index) => (
			<WrapItem key={index}>
				<MovieCard movie={item.favMovie} w={['120px', '150px']}
								onFavoriteClick={()=>handleFavoriteClick(item.favMovie)}/>
			</WrapItem>
		))}
	</Wrap>;
};

export default UserFavorites;
