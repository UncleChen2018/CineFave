import React from 'react';
import {
	Box,
	VStack,
	Heading,
	HStack,
	Image,
	Text,
	Tag,
	TagLabel,
	TagLeftIcon,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

function ReviewList({ reviews }) {
	return (
		<VStack align='start' spacing={8}>
			<Heading as='h3' size='lg'>
				Reviews from Network
			</Heading>
			{reviews.map((review) => (
				<Box key={review.id} p={5} shadow='md' borderWidth='1px'>
					<HStack>
						{review.author_details.avatar_path ? (
							<Image
								borderRadius='full'
								boxSize='50px'
								src={`https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`}
								alt={`Avatar of ${review.author}`}
							/>
						) : (
							<Box borderRadius='full' boxSize='50px' bg='gray.200' />
						)}
						<VStack align='start'>
							<Text fontWeight='bold'>{review.author}</Text>
							<HStack>
								{review.author_details.rating && (
									<Tag colorScheme='yellow' borderRadius='full'>
										<TagLeftIcon boxSize='12px' as={FaStar} />
										<TagLabel>{review.author_details.rating * 10}%</TagLabel>
									</Tag>
								)}
								<Text fontSize='sm'>
									Written on {new Date(review.created_at).toLocaleDateString()}
								</Text>
							</HStack>
						</VStack>
					</HStack>
					<Box m='2' p='2'>
						<ReactMarkdown
							components={{
								// Customize how different "nodes" in the Markdown are rendered:
								p: ({ node, ...props }) => <Text {...props} />,
								// Add other components as needed for headings, images, etc.
							}}
						>
							{review.content}
						</ReactMarkdown>
					</Box>
					{/* Add more review details here */}
				</Box>
			))}
		</VStack>
	);
}

export default ReviewList;
