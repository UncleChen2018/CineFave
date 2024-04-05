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
			<Box position='relative'>
				<Image src={imageUrl} alt={`Poster of ${title}`} />
				<CircularProgress
					value={rating * 10}
					color={colorScheme}
					size='40px'
					position='absolute'
					bottom='-20px'
					left='5%'
					zIndex='1'
					bg='black'
					borderRadius='50%'
		
				>
					<CircularProgressLabel fontSize='16px'  bg='black.200' color="whitesmoke">{rating * 10}</CircularProgressLabel>
				</CircularProgress>
				<IconButton 
						aria-label='Like movie'
						icon={isLiked ? <AiFillHeart color='red' size="1.25em"/> : <AiOutlineHeart size='1.25em'/>}
						variant='ghost'
						isRound={true}
						w='20px'
						pos='absolute'
						top='25px'
						right='5%'
						bg='whitesmoke'
					/>
			</Box>
			<Box p='4' position='relative' zIndex='0' mt='20px'>
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
