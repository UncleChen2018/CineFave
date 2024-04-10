import React from 'react';
import {
	Box,
	Image,
	Flex,
	CircularProgress,
	CircularProgressLabel,
	IconButton,
	Text,
} from '@chakra-ui/react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import { HamburgerIcon } from '@chakra-ui/icons';

function ratingToColor(rating) {
	if (rating >= 7) {
		return 'green.400';
	} else if (rating >= 4) {
		return 'yellow.400';
	} else {
		return 'red.400';
	}
}

export default function MovieCard({ movie, w }) {
	const { id, title, releaseDate, imageUrl, rating, isLiked } = movie;
	const colorScheme = ratingToColor(rating);

	const navigate = useNavigate();
	const navigateToMovieDetail = () => {
		navigate(`/movie/${id}`);
	};

	return (
		<Box
			maxW='sm'
			borderWidth='1px'
			borderRadius='lg'
			overflow='hidden'
			position='relative'
			fontSize={['sm', 'sm', 'md', 'md']}
			w={w}
		>
			<Box position='relative'>
				<Image
					src={imageUrl}
					alt={`Poster of ${title}`}
					cursor='pointer'
					onClick={navigateToMovieDetail}
				/>
				<CircularProgress
					value={Math.round(rating * 10)}
					color={colorScheme}
					size='1.5em'
					position='absolute'
					bottom='-0.75em'
					left='5%'
					zIndex='1'
					bg='black'
					borderRadius='50%'
				>
					<CircularProgressLabel
						fontSize='16px'
						bg='black.200'
						color='whitesmoke'
					>
						{Math.round(rating * 10)}
						<Text  as="span" fontSize="0.5em" lineHeight="16px">%</Text>
					</CircularProgressLabel>
				</CircularProgress>
				<IconButton
					aria-label='Like movie'
					icon={
						isLiked ? (
							<AiFillHeart color='red' size='1.25em' />
						) : (
							<AiOutlineHeart size='1.25em' />
						)
					}
					variant='ghost'
					isRound={true}
					pos='absolute'
					top='10%'
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
			<Box p='2' position='relative' mt='10px'>
				<Flex
					direction='column'
					justifyContent='center' // This will center the content vertically
					height='3rem' // Set a fixed height large enough to contain one or two lines
				>
					<Text fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={2}>
						{title}
					</Text>
				</Flex>
				<Text color='gray.500' fontSize='sm'>
					{releaseDate}
				</Text>
			</Box>
		</Box>
	);
}
