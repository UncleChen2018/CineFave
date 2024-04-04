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

export default function MovieCard({
	title,
	releaseDate,
	imageUrl,
	rating,
	w,
	isLiked = false,
}) {
	const colorScheme = ratingToColor(rating);
	return (
		<Box
			maxW='sm'
			borderWidth='1px'
			borderRadius='lg'
			overflow='hidden'
			position='relative'
			w={w}
		>
			<Image src={imageUrl} alt={`Poster of ${title}`} />
			<Box p='4'>
				<Flex mb='2' align='center' justify='space-between'>
					<CircularProgress value={rating * 10} color={colorScheme} size='50px'>
						<CircularProgressLabel>{rating * 10}%</CircularProgressLabel>
					</CircularProgress>
					<IconButton
						aria-label='Like movie'
						icon={isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
						variant='ghost'
						isRound={true}
					/>
					<IconButton
						aria-label='More options'
						icon={<HamburgerIcon />}
						variant='ghost'
						isRound={true}
					/>
				</Flex>
				<Text
					mt='1'
					fontWeight='semibold'
					as='h4'
					lineHeight='tight'
					noOfLines={2}
				>
					{title}
				</Text>
				<Text color='gray.500' fontSize='sm'>
					{releaseDate}
				</Text>
			</Box>
		</Box>
	);
}
