import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Textarea,Text, HStack } from '@chakra-ui/react';
import { useUserInfo } from '../UserInfoContext'; // Import our context hook
import { useNavigate } from 'react-router-dom';


import MarkdownEditor from './MarkdownEditor';
import useUpdateUserProfile from '../hooks/useUpdateUserProfile';

const EditProfile = () => {

  const { userProfile } = useUserInfo();  // Get the userInfo from the context

  const { updateUserProfile, isLoading, error } = useUpdateUserProfile();
  const [bio, setBio] = useState(userProfile.bio);
  const [nickname, setNickname] = useState(userProfile.nickname);

  useEffect(() => {
    setBio(userProfile.bio);
    setNickname(userProfile.nickname);
  }, [userProfile]);
  

  const navigate = useNavigate();



  const handleSave = () => {
    updateUserProfile({...userProfile,nickname,bio}); // Call the hook to update the user profile
    navigate('/profile'); // Navigate back to the profile page after saving
  };

  const handleCancel = () => {
    navigate('/profile'); // Navigate back without saving any changes
  };

  return (
    <Flex direction="column" align="start" width={'full'} p='4'>
      <Box>
        <Text fontSize="md" color="gray.500">Nickname:</Text>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </Box>
      <Box mt='2' maxW='100%'>
        <Text fontSize="md" color="gray.500">Bio:</Text>
        <MarkdownEditor
          initialText={bio}
          onChange={setBio}
        />
      </Box>
      <HStack align='center' mt={4}>
      <Button mr='20px' colorScheme="blue" onClick={handleSave}>
        Save
      </Button>
      <Button colorScheme="orange" onClick={handleCancel}>
          Cancel
        </Button>

        </HStack>
    </Flex>
  );
};

export default EditProfile;
