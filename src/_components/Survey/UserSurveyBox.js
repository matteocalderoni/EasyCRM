import React, { useEffect, useState } from "react";
import { surveyService } from '../../_services/survey.service'
import { UserSiteSurveyBox } from './UserSiteSurveyBox'
import { UserSurveyAnswerBox } from "./UserSurveyAnswerBox";

function UserSurveyBox({appSiteId, siteSurveyId, userSurveyId}) {

    const [userSurvey, setUserSurvey] = useState()
    const [userAnswers, setUserAnswers] = useState([])

    useEffect(() => {
        surveyService.getUserSurveyById(appSiteId,siteSurveyId,userSurveyId)
            .then((_userSurvey) => setUserSurvey(_userSurvey))
    }, [appSiteId, siteSurveyId, userSurveyId])    

    useEffect(() => {
        surveyService.getUserAnswers(appSiteId,siteSurveyId,userSurveyId)
            .then((_userAnswers) => setUserAnswers(_userAnswers))
    },[appSiteId,siteSurveyId,userSurveyId])

    return (
        <>            
            <UserSiteSurveyBox appSiteId={appSiteId} siteSurveyId={siteSurveyId} />
                        
            {userAnswers && userAnswers.length > 0 && userAnswers.map(_userAnswer => 
            <div>
                <UserSurveyAnswerBox 
                    appSiteId={_userAnswer.appSiteId} 
                    siteSurveyId={_userAnswer.siteSurveyId} 
                    surveyStepId={_userAnswer.surveyStepId} 
                    stepQuestionId={_userAnswer.stepQuestionId} 
                    questionAnswerId={_userAnswer.questionAnswerId}
                    quantity={_userAnswer.quantity} />
            </div>)}            
        </>
    );
}

export { UserSurveyBox }