import "../style/home.css";

import MovieCard from "./MovieCard";
import MovieCarousel from "./MovieCarousel";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";


const movie = {
  title: 'example',
  releaseDate: '2012-02-02',
  imageUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
  rating: '3.',
  isLiked: false,
}

const movies = Array.from({ length: 10 }, () => ({ ...movie }));

// the home page should contain the 
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    <div className="home">
      <MovieCarousel movies={movies} w='150px' width="100%"/>

    </div>
  );
}


