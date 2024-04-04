import "../style/home.css";
import { Box, Image, Text, Flex, CircularProgress,CircularProgressLabel,IconButton } from '@chakra-ui/react';
import { HamburgerIcon,ViewIcon } from '@chakra-ui/icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

import MovieCard from "./MovieCard";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// the home page should contain the 
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <div className="home">
      <MovieCard w='220px' title = 'hewrwerewrwerewrewrewrewrsafdsgfdfgdgdgtedgdgdfgfdrdterth' releaseDate='2012-02-02' imageUrl='https://media.themoviedb.org/t/p/w220_and_h330_face/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg' rating='3.' />
    </div>
  );
}


