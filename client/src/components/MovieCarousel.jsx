import { Box, Flex, Button, useBreakpointValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import React, { useRef, useEffect, useState } from 'react';
import MovieCard from './MovieCard'; // Adjust the import path as necessary

export default function MovieCarousel({ movies, w }) {
	const scrollContainer = useRef(null);
	// Call useBreakpointValue at the top level of your component
	//const scrollAmount = useBreakpointValue({ base: 150, md: 300, lg: 450 }) || 300;
	const gap = 4;
	const scrollAmount = 2*(parseInt(w, 10) + gap * 4);
	const scroll = (direction) => {
		const { current } = scrollContainer;
		if (current) {
			current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
		}
	};

	return (
		<Box position='relative' width='full' overflow='hidden'>
			<Flex
				gap={gap}
				ref={scrollContainer}
				overflowX='auto'
				scrollBehavior='smooth'
				// Apply CSS to hide the scrollbar
				css={{
					'&::-webkit-scrollbar': {
						display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
					},
					msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
					scrollbarWidth: 'none', // Hide scrollbar for Firefox
				}}
			>
				{movies.map((movie, index) => (
					<Box key={index} flexShrink={0} flexGrow={0}>
						<MovieCard movie={movie} w={w} />
					</Box>
				))}
			</Flex>
			<Button
      
				position='absolute'
				left='0'
				top='50%'
				transform='translateY(-50%)'
				zIndex='banner'
				onClick={() => scroll('left')}
				size={['sm', 'sm', 'md', 'md']}
			>
				<ChevronLeftIcon />
			</Button>
			<Button
				position='absolute'
				right='0'
				top='50%'
				transform='translateY(-50%)'
				zIndex='banner'
				onClick={() => scroll('right')}
				size={['sm', 'sm', 'md', 'md']}
			>
				<ChevronRightIcon />
			</Button>
		</Box>
	);
}
