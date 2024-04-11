import React,{useState, useRef, useEffect} from 'react';
import {
	Box,
	VStack,
  Button,
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
	if (!reviews || reviews.length === 0) {
		return (
			<VStack align='start' spacing={8}>
				<Heading as='h3' size='lg'>
					Reviews from Network
				</Heading>
				<Text px='4'>No reviews available.</Text>
			</VStack>
		);
	}

	return (
		<VStack align='start' spacing={8}>
			<Heading as='h3' size='lg' width='full'>
				Reviews from Network
			</Heading>
			{reviews.map((review) => (
				<Box key={review.id} p={5} shadow='md' borderWidth='1px' width='full'>
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
					<CollapsibleMarkdown content={review.content} />
					{/* Add more review details here */}
				</Box>
			))}
		</VStack>
	);
}


function CollapsibleMarkdown({ content }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const contentRef = useRef(null); // Create a ref for the markdown content

  useEffect(() => {
    // Check the content height and determine if it overflows
    const checkContentOverflow = () => {
      const current = contentRef.current;
      if (current) {
        // Compare the scrollHeight (actual height) with the clientHeight (visible height)
        const isOverflowing = current.scrollHeight > current.clientHeight;
        setIsContentOverflowing(isOverflowing);
      }
    };

    // Run the check after the component mounts
    checkContentOverflow();
    // Add resize listener to handle window resizing
    window.addEventListener('resize', checkContentOverflow);

    // Clean up listener to prevent memory leaks
    return () => {
      window.removeEventListener('resize', checkContentOverflow);
    };
  }, []); // Empty dependency array ensures this effect runs only once after mount

  return (
    <Box m="2" p="2">
      <Box
        ref={contentRef} // Attach the ref to the Box
        maxHeight={isCollapsed ? '200px' : 'none'} // Set the maxHeight only when collapsed
        overflow="hidden"
        position="relative"
      >
        <ReactMarkdown
          components={{
            // ... your custom components
          }}
        >
          {content}
        </ReactMarkdown>
      </Box>
      {isContentOverflowing && isCollapsed && (
        <Text
          as="span"
          onClick={() => setIsCollapsed(false)}
          color="blue.500"
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          display="block"
          textAlign="right"
        >
          View More
        </Text>
      )}
    </Box>
  );
}


export default ReviewList;
