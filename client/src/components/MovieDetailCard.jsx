import React from 'react';
import {Tag, SimpleGrid, Box, Icon, Image, VStack, Heading, Text, Link, HStack } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import GenreTags from './GenreTags'; // Assuming you have this component for displaying genres

function MovieDetailCard({ movie }) {
  const { poster_path, title, release_date, tagline, genres, overview, homepage, production_companies } = movie;
  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;

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
      >
        <Image
          src={poster_path}
          alt={`Poster of ${title}`}
          borderRadius="lg"
        />
      </Box>
      <VStack align="start" spacing={4}>
        <Heading as="h2" size="xl">
          {title} ({new Date(release_date).getFullYear()})
        </Heading>
        {tagline && (
          <Text fontSize="xl" color="blue.500" fontStyle="italic" fontWeight="bold" >
            "{tagline}"
          </Text>
        )}
        <GenreTags genres={genres} />
        <Text fontSize="md" color="gray.600">
          {release_date} • {runtimeHours}h {runtimeMinutes}m
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
