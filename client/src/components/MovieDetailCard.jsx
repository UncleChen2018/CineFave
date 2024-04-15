import React,{useEffect,useState} from 'react';
import {Tag, SimpleGrid, Box, Icon, Image, VStack, Heading, Text, Link, HStack,IconButton } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import GenreTags from './GenreTags'; // Assuming you have this component for displaying genres
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import useToggleFavorite from '../hooks/useToggleFavorite';
import { useUserInfo } from '../UserInfoContext';


function MovieDetailCard({ movie }) {
  const { imageUrl, title, releaseDate, tagline, genres, overview, homepage, production_companies} = movie;
  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;
  const { toggleFavorite } = useToggleFavorite();
  const { favorites } = useUserInfo();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(favorites.some((fav) => fav.movieId === movie.id));
  }, [favorites, movie]);
  
  return (
    <SimpleGrid templateColumns={{ base: '1fr', md: 'auto 1fr' }} spacing={10}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
      >
        <Image
          src={imageUrl}
          alt={`Poster of ${title}`}
          borderRadius="lg"
        />
        <IconButton
					aria-label='Like movie'
					icon={
						isLiked ? (
							<AiFillHeart color='crimson' size='2em' />
						) : (
							<AiOutlineHeart size='2em' />
						)
					}
					onClick={() => toggleFavorite(movie)}
					variant='ghost'
					isRound={true}
					pos='absolute'
					top='6%'
					right='5%'
					bg='whitesmoke'
					sx={{
						padding: '0.375em', // Reducing padding to decrease the background size
						minWidth: 'auto', // Override minimum width to allow smaller button size
						minHeight: 'auto', // Override minimum height to allow smaller button size
						width: 'auto', // Adjust if you want to specify a fixed width
						height: 'auto', // Adjust if you want to specify a fixed height
					}}
				/>
      </Box>
      <VStack align="start" spacing={4}>
        <Text fontSize="md" color="gray.600">{JSON.stringify(favorites)}</Text>
        <Text fontSize="md" color="gray.600">{String(isLiked)}</Text>
        <Heading as="h2" size="xl">
          {title} ({new Date(releaseDate).getFullYear()})
        </Heading>
        {tagline && (
          <Text fontSize="xl" color="blue.500" fontStyle="italic" fontWeight="bold" >
            "{tagline}"
          </Text>
        )}
        <GenreTags genres={genres} />
        <Text fontSize="md" color="gray.600">
          {releaseDate} • {runtimeHours}h {runtimeMinutes}m
        </Text>
        <Text fontSize="lg">{overview}</Text>
        {homepage && (
          <Link href={homepage} isExternal color="teal.500" fontWeight="bold">
            <HStack>
              <Icon as={ExternalLinkIcon} />
              <Text>Official Website</Text>
            </HStack>
          </Link>
        )}
        <HStack spacing={2} wrap="wrap">
          {production_companies.map((company) => (
            <Tag key={company.id} size="md" borderRadius="full" variant="outline" colorScheme="gray">
              {company.name}
            </Tag>
          ))}
        </HStack>
      </VStack>
    </SimpleGrid>
  );
}

export default MovieDetailCard;
