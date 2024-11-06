import React, { useRef } from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';

interface IFileUploadProps {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const FileUpload: React.FC<IFileUploadProps> = (props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
        setFileName(uploadedFile.name);
        props.handleFileChange(event);
    }
  };

  return (
    <Flex textAlign="center" gap={3}>
      <Input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button colorScheme="blue" onClick={handleClick}>
        Selected File
      </Button>
      {fileName && <Text mt={2}>File: {fileName}</Text>}
    </Flex>
  );
};

export default FileUpload;
