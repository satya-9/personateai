import React, { useState } from 'react';
import { Progress, Text, Modal } from '@mantine/core';
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
    const [modalOpen, setModalOpen] = useState(false)
    const [errorInUpload, setErrorInUpload] = useState("")

    const progressElementVisible = () => {
        if (progress === 100) {
            setProgress(0)
            setVisibleProgress(false)
            setVideoUrl(null)
            setFileName("")
        }
    }

    const handleDrop = async (file) => {
        setProgress(0);
        if (file.type !== 'video/mp4') {
            setModalOpen(true)
            setErrorInUpload(`Please enter valid video extension file of mp4 format `)
            return;
        }

        setFileName(file.name)
        setVideoUrl(null)
        config.update({
            accessKeyId: process.env.REACT_APP_ACCESSKEYID,
            secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
            region: process.env.REACT_APP_REGION,
        });
        const s3 = new S3({
            signatureVersion: 'v4',
            httpOptions: {
                maxBodyLength: 1073741824,
                maxContentLength: 1073741824,
                minContentLength: 52428800
              }
        });
        console.log(fileName)
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

        await axios.put(url, file, {
            headers: {
                'Content-Type': 'video/mp4'
            },
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted)
                setVisibleProgress(true)
            }
        }).then(async (response) => {
            const videoUrl = s3.getSignedUrl('getObject', videoParams)
            setVideoUrl(videoUrl)
        }).catch(error => {
            setModalOpen(true)
            setErrorInUpload(`Error in uploading the file `)
            setVisibleProgress(false)
            setVideoUrl(null)
        });
    };

    return (
        <div className='uploader'>
            {videoUrl && (
                <div className="video">
                    <iframe src={videoUrl} title={videoUrl} className="iframe" />
                </div>
            )}
            <div className='dropZoneAndProgress'>
                <FileDropZone onDrop={handleDrop} />
                {(progress > 0) && (visibleProgress) && (

                    <div className='closeandprogress'>
                        {(progress === 100) &&
                            (
                                <div className='close-btn' onClick={progressElementVisible}>
                                    <IoIosCloseCircle size={25} style={{ color: "blue" }} />
                                </div>
                            )}
                        <div className='progress'>
                            <div className='triangleright'>
                                <GoTriangleRight size={40} width={100} style={{ color: "blue" }} />
                            </div>
                            <div className='fileandprogress'>
                                <Text className='fileName'>{fileName}</Text>
                                <Progress value={progress} label={<Text className='progressLabel'>{progress}</Text>} className="progressBar" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal opened={modalOpen}
                closeButtonProps={{ color: 'blue' }}
                onClose={() => { setModalOpen(false) }}
                title={<Text className='modalTitle'> Video Uploading Error</Text>}
                className="modalComponent">
                <Text className='uploadError'>{errorInUpload}</Text>
            </Modal>

        </div>
    );
}

export default VideoUploader;
