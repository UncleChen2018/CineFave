import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import AuthDebugger from "./components/AuthDebugger";

// import chakra ui components
import { ChakraProvider,Box, Container  } from '@chakra-ui/react'
import theme from './theme';
import Header from "./components/Header";
import AppLayout from "./components/AppLayout";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ["profile", "email"];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  // If the user is not authenticated, redirect to the home page
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, display the children (the protected page)
  return children;
}


root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
      <ChakraProvider theme={theme}>
        <BrowserRouter>    
        <Container maxW='1280px' w='100%' mx='auto' px={0}>  
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<AuthDebugger />} />
            <Route
              path="app"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            ></Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Container>  
        </BrowserRouter>
        
        </ChakraProvider>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
