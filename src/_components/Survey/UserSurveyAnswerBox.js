import React, { useEffect, useState } from "react";
import { surveyService } from '../../_services/survey.service'
import parse from 'html-react-parser';
import { SiteProductPreviewSmall } from "../SiteProductPreviewSmall";

function UserSurveyAnswerBox({appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId, quantity}) {
        
    const [questionAnswer, setQuestionAnswer] = useState()    

    useEffect(() => {
        surveyService.getQuestionAnswerById(appSiteId,siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId)
            .then((_questionAnswer) => setQuestionAnswer(_questionAnswer))
    }, [appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId])            
    
    return (
        <div className="flex">
            <div className="rounded-full overflow-hidden p-2 px-3 bg-green-700 text-white">
                {quantity}
            </div>
            {questionAnswer && 
            <div className="p-1 w-full">
                {questionAnswer.answerText && questionAnswer.siteProductId === 0  && <label>{parse(questionAnswer.answerText)}</label>}
                {questionAnswer.siteProductId > 0 &&
                <SiteProductPreviewSmall 
                    appSiteId={questionAnswer.appSiteId} 
                    siteProductId={questionAnswer.siteProductId}
                    onChange={() => null}
                    readOnly={true}
                    />}
            </div>}            
        </div>
    );
}

export { UserSurveyAnswerBox }