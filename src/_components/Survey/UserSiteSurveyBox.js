import React, { useEffect, useState } from "react";
import { surveyService } from '../../_services/survey.service'

function UserSiteSurveyBox({appSiteId, siteSurveyId}) {
        
    const [siteSurvey, setSiteSurvey] = useState()

    useEffect(() => {
        surveyService.getSiteSurveyById(appSiteId,siteSurveyId)
            .then((_siteSurvey) => setSiteSurvey(_siteSurvey))
    }, [appSiteId, siteSurveyId])        
    
    return (
        <div>
            {siteSurvey && 
            <label>{siteSurvey.siteSurveyName}</label>}
        </div>
    );
}

export { UserSiteSurveyBox }