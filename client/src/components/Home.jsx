import "../style/home.css";


import MovieCard from "./MovieCard";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";



const movies = new Array(10).fill(null).map((_, index) => ({
  id: index,
  title: `Movie ${index + 1}`,
  rating: Math.floor(Math.random() * 100) + 1,
  isLiked: Math.random() > 0.5,
  releaseDate: '2024-01-01',
  imageUrl: 'https://media.themoviedb.org/t/p/w220_and_h330_face/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
}));

// the home page should contain the 
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  return (
    
    <div className="home">
      {/* <MoviesCarousel movies={movies} w='220px' /> */}
      <MovieCard w='220px' title = 'Shōgun' releaseDate='2012-02-02' imageUrl='https://media.themoviedb.org/t/p/w220_and_h330_face/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg' rating='9.' isLiked={false} /> 
    </div>
  );
}


