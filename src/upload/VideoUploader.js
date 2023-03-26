import React, { useState } from 'react';
import { Progress, Text } from '@mantine/core';
import FileDropZone from '../filesDropZone/FileDropZone';
import { S3, config } from 'aws-sdk';
import axios from "axios";
import { GoTriangleRight } from "react-icons/go"
import "./videoUploader.css"
import { IoIosCloseCircle } from "react-icons/io"

function VideoUploader() {
    const [progress, setProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState(null);
    const [fileName, setFileName] = useState("")
    const [visibleProgress, setVisibleProgress] = useState(false);

    const progressElementVisible=()=>{
        setProgress(0)
        setVisibleProgress(false)
        setVideoUrl(null)
    }

    const handleDrop = async (file) => {
        setProgress(0);
        if (file.type !== 'video/mp4') {
            alert('Please select an MP4 file.');
            return;
        }

        setFileName(file.name)
        config.update({
            accessKeyId: process.env.REACT_APP_ACCESSKEYID,
            secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
            region: process.env.REACT_APP_REGION,
        });
        const s3 = new S3({
            signatureVersion: 'v4'
        });

        const params = {
            Bucket: process.env.REACT_APP_BUCKET,
            Key: file.name,
            ContentType: 'video/mp4',
            Expires: 300 // URL expiration time in seconds
        };
        const videoParams = {
            Bucket: process.env.REACT_APP_BUCKET,
            Key: file.name,
            Expires: 300 // URL expiration time in seconds
        }

        // Generate the pre-signed URL for a PUT operation
        const url = s3.getSignedUrl('putObject', params);

        // const options = {
        //     partSize: 1024 * 1024 * 5, // 5 MB
        //     queueSize: 1,
        // };

        await axios.put(url, file, {
            headers: {
                'Content-Type': 'video/mp4'
            },
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted)
                setVisibleProgress(true)
            }

        }).then(() => {
            const videoUrl = s3.getSignedUrl('getObject', videoParams);
            setVideoUrl(videoUrl)
        }).catch(error => {
            console.error('Error uploading file:', error);
        });
    };

    return (
        <div className='uploader'>
            {videoUrl && (
                <div className="video">
                    <iframe src={videoUrl} title={videoUrl} className="video" />
                </div>
            )}
            <div className='dropZoneAndProgress'>
                <FileDropZone onDrop={handleDrop} />
                {(progress > 0) && (visibleProgress) && (
                    <div className='closeandprogress'>
                        <div className='close-btn' onClick={progressElementVisible}>
                            <IoIosCloseCircle size={25} style={{ color: "blue" }} />
                        </div>
                        <div className='progress'>
                            <div className='triangleright'>
                                <GoTriangleRight size={40} width={100} style={{ color: "blue" }} />
                            </div>
                            <div className='fileandprogress'>
                                <Text>{fileName}</Text>
                                <Progress value={progress} />
                            </div>
                        </div>
                    </div>
                )
                }
            </div>

        </div>
    );
}

export default VideoUploader;
