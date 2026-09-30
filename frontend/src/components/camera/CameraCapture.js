import React, { useEffect, useRef } from "react";

const CameraCapture = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        let active = true;
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
            .then((stream) => {
                if (!active) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(() => {
                if (active) {
                    onCloseRef.current("Camera isn't available. Choose an image file instead.");
                }
            });

        return () => {
            active = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const capture = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) {
            return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) {
                return;
            }
            const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
            onCapture(file);
        }, "image/jpeg", 0.9);
    };

    return (
        <div className="camera-capture">
            <video ref={videoRef} autoPlay playsInline muted />
            <div className="--flex-start --my">
                <button type="button" className="--btn --btn-primary" onClick={capture}>Capture</button>
                <button type="button" className="--btn --btn-danger" onClick={() => onClose()}>Cancel</button>
            </div>
        </div>
    );
};

export default CameraCapture;
