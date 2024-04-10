import React from 'react';
import { Tag, Wrap, WrapItem } from '@chakra-ui/react';

const genreColorMap = {
  28: "red",        // Action
  12: "orange",     // Adventure
  16: "yellow",     // Animation
  35: "green",      // Comedy
  80: "teal",       // Crime
  99: "blue",       // Documentary
  18: "cyan",       // Drama
  10751: "purple",  // Family
  14: "pink",       // Fantasy
  36: "gray",       // History
  27: "linkedin",   // Horror
  10402: "facebook",// Music
  9648: "messenger",// Mystery
  10749: "whatsapp",// Romance
  878: "twitter",   // Science Fiction
  10770: "telegram",// TV Movie
  53: "red",        // Thriller
  10752: "orange",  // War
  37: "yellow",     // Western
};


function getGenreColor(id) {
  // If the genre ID is in the map, return the corresponding color.
  // Otherwise, default to 'gray'
  return genreColorMap[id] || 'gray';
}

function GenreTags({ genres }) {
  return (
    <Wrap>
      {genres.map((genre) => (
        <WrapItem key={genre.id}>
          <Tag size="md" borderRadius="full" variant="solid" colorScheme={getGenreColor(genre.id)}>
            {genre.name}
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
}

export default GenreTags;
