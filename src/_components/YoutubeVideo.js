import React from 'react';
import ReactPlayer from "react-player"

function YoutubeVideo({ videoUrl, title, boxColor }) {
    
    return (
        <div style={{backgroundColor: boxColor}}>
            <div className="mt-2 mb-2 text-center">
                <h1>{title}</h1>         
                <ReactPlayer url={videoUrl} className="youtube-video" width="100%" />
            </div>
        </div>
    );
}

export { YoutubeVideo };