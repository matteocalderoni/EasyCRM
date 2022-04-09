import React, { useEffect, useState } from "react";
import { surveyService } from '../../_services/survey.service'
import { Image } from 'react-bootstrap'

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function UserSiteSurveyBox({appSiteId, siteSurveyId}) {
        
    const [siteSurvey, setSiteSurvey] = useState()

    useEffect(() => {
        surveyService.getSiteSurveyById(appSiteId,siteSurveyId)
            .then((_siteSurvey) => setSiteSurvey(_siteSurvey))
    }, [appSiteId, siteSurveyId])        
    
    return (
        <div className="m-1">
            {siteSurvey &&             
            <div className="flex items-center border bg-white rounded-xl overflow-hidden md:flex">
                {siteSurvey.imageUrl && 
                <Image className='w-full md:w-24 h-12' src={baseImageUrl+siteSurvey.imageUrl} fluid />}
                <label>{siteSurvey.siteSurveyName}</label>
            </div>}
        </div>
    );
}

export { UserSiteSurveyBox }