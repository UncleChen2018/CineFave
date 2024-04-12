import React, { useState } from 'react';
import { Box, Button, Flex, Input, Textarea,Text } from '@chakra-ui/react';
import { useUserInfo } from '../UserInfoContext'; // Import our context hook
import { useNavigate } from 'react-router-dom';
import useUpdateUserProfile from '../hooks/useUpdateUserProfile';

const EditProfile = () => {
  const { userInfo, userProfile,setUserProfile } = useUserInfo();  // Get the userInfo from the context

  const { updateUserProfile, isLoading, error } = useUpdateUserProfile();
  const [localUserInfo, setLocalUserInfo] = useState({ ...userInfo });

  const navigate = useNavigate();

  const handleSave = () => {
    setUserProfile(...userProfile, localUserInfo);
    // Here you would also call your API to update the userInfo on the backend
    updateUserProfile(localUserInfo); // Call the hook to update the user profile
    navigate('/profile'); // Navigate back to the profile page after saving
  };

  return (
    <Flex direction="column" align="center">
      <Box>
        <Text fontSize="md" color="gray.500">Nickname:</Text>
        <Input
          value={localUserInfo.nickname}
          onChange={(e) => setLocalUserInfo({ ...localUserInfo, nickname: e.target.value })}
        />
      </Box>
      <Box>
        <Text fontSize="md" color="gray.500">Bio:</Text>
        <Textarea
          value={localUserInfo.bio}
          onChange={(e) => setLocalUserInfo({ ...localUserInfo, bio: e.target.value })}
        />
      </Box>
      <Button mt={4} colorScheme="blue" onClick={handleSave}>
        Save Changes
      </Button>
    </Flex>
  );
};

export default EditProfile;
