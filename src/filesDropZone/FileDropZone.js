import { Box, Button, Text } from '@mantine/core';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './filesdropzone.css';
import { BsUpload } from "react-icons/bs";


function FileDropZone({ onDrop }) {
    const handleDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        onDrop(file);
    }, [onDrop]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: ["video/mp4"],
        onDrop: handleDrop,
    });

    return (
        <div >
            <Text className='uploadText'>You can upload video</Text>
            <div {...getRootProps({ accept: 'video/*' })} className="dropFiles">
            <Text className='dropText' >CLICK ON THE BUTTON OR DRAG & DROP FILES HERE</Text>
                <input {...getInputProps()} />
                <Box w={300} >
                    <Button fullWidth color={'blue'} leftIcon={<BsUpload />} >Upload Video </Button>
                </Box>
            </div>
        </div>
    );
}

export default FileDropZone;
