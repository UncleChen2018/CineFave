import React, { useState, useRef, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import MarkdownReader from './MarkdownReader';

const CollapsibleMarkdown = ({ content, maxHeight = '200px' }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkContentOverflow = () => {
      if (contentRef.current) {
        setIsContentOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
      }
    };

    checkContentOverflow();
    window.addEventListener('resize', checkContentOverflow);
    return () => window.removeEventListener('resize', checkContentOverflow);
  }, [content]);

  return (
    <Box mt='2'>
      <Box
        ref={contentRef}
        maxHeight={isCollapsed ? maxHeight : 'none'}
        overflow='hidden'
        position='relative'
        zIndex='0'
      >
        <MarkdownReader content={content} />
      </Box>
      {isContentOverflowing && isCollapsed && (
        <Text 
          as='span'
          onClick={() => setIsCollapsed(false)}
          color='blue.500'
          _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          display='block'
          textAlign='right'
          zIndex='1'
        >
          View More
        </Text>
      )}
    </Box>
  );
};

export default CollapsibleMarkdown;
