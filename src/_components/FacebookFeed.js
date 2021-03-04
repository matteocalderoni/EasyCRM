import React from 'react';
import { FacebookProvider, Page } from 'react-facebook';

const facebook_appid = `${process.env.REACT_APP_FACEBOOK_APPID}/`;

function FacebookFeed({ feedUrl, title, boxColor }) {
    
    return (
        <div style={{backgroundColor: boxColor}}>
            <div className="mt-2 mb-2">
                <h1>{title}</h1>         
                <FacebookProvider appId={facebook_appid}>
                    <Page href={feedUrl} tabs="timeline" />                
                </FacebookProvider>
            </div>
        </div>
    );
}

export { FacebookFeed };