import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Image, Text } from '@chakra-ui/react';

const MarkdownReader = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        // Wrap text and break words to prevent overflow
        p: ({ node, ...props }) => (
          <Text {...props} wordBreak='break-word' />
        ),
        // Make images responsive
        img: ({ node, ...props }) => <Image {...props} maxW='100%' onLoad={() => window.dispatchEvent(new Event('resize'))}  />,
        // Handle code blocks or preformatted text
        code: ({ node, ...props }) => (
          <Box as='code' {...props} overflowX='auto' />
        ),
        pre: ({ node, ...props }) => (
          <Box
            as='pre'
            {...props}
            overflowX='auto'
            whiteSpace='pre-wrap'
            wordBreak='break-word'
          />
        ),
        // Add other components as needed
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownReader;
