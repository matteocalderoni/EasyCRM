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
            {userSurvey && 
            <div>
                <label>{userSurvey.userSurveyId}</label>
            </div>}

            <UserSiteSurveyBox appSiteId={appSiteId} siteSurveyId={siteSurveyId} />
            
            <div>
                <ul>
                    {userAnswers && userAnswers.length > 0 && userAnswers.map(_userAnswer => 
                    <li>
                        <UserSurveyAnswerBox 
                            appSiteId={_userAnswer.appSiteId} 
                            siteSurveyId={_userAnswer.siteSurveyId} 
                            surveyStepId={_userAnswer.surveyStepId} 
                            stepQuestionId={_userAnswer.stepQuestionId} 
                            questionAnswerId={_userAnswer.questionAnswerId} />
                    </li>
                    )}
                </ul>
            </div>
        </>
    );
}

export { UserSurveyBox }