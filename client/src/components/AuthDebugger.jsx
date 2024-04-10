import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { Box, Text, Code } from "@chakra-ui/react";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <Box width="full"   p={5}>
      <Box mb={5}>
        <Text fontSize="lg" mb={2}>Access Token:</Text>
        <Code display="block" whiteSpace="pre-wrap" p={3}>
          {JSON.stringify(accessToken, null, 2)}
        </Code>
      </Box>
      <Box>
        <Text fontSize="lg" mb={2}>User Info</Text>
        <Code display="block" whiteSpace="pre-wrap" p={3}>
          {JSON.stringify(user, null, 2)}
        </Code>
      </Box>
    </Box>
  );
}
