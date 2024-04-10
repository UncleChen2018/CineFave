import React from 'react';
import { SimpleGrid, Box, Image, VStack, Heading, Text, Link, HStack } from '@chakra-ui/react';
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
          src={`https://image.tmdb.org/t/p/w342${poster_path}`}
          alt={`Poster of ${title}`}
          borderRadius="lg"
        />
      </Box>
      <VStack align="start" spacing={4}>
        <Heading as="h2" size="xl">
          {title} ({new Date(release_date).getFullYear()})
        </Heading>
        {tagline && <Text fontStyle="italic">"{tagline}"</Text>}
        <GenreTags genres={genres} />
        <Text fontSize="md" color="gray.600">
          {release_date} • {runtimeHours}h {runtimeMinutes}m
        </Text>
        <Text fontSize="lg">{overview}</Text>
        {homepage && (
          <Link href={homepage} isExternal>
            Official Website
          </Link>
        )}
        <HStack>
          {production_companies.map((company) => (
            <Text key={company.id} fontSize="sm">
              {company.name}
            </Text>
          ))}
        </HStack>
      </VStack>
    </SimpleGrid>
  );
}

export default MovieDetailCard;
