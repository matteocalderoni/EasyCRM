import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SiteSurveyList } from './SiteSurveyList';
import { SiteSurveyDetail } from './SiteSurveyDetail';
import { OutcomeTypeList } from './OutcomeType/OutcomeTypeList';
import { OutcomeTypeDetail } from './OutcomeType/OutcomeTypeDetail';

function SiteSurveys({ match }) {
    const { path } = match;
    
    return (
        <Switch>                                       
            <Route path={`${path}/outcometypes/edit/:appSiteId/:outcomeTypeId`} component={OutcomeTypeDetail} />            
            <Route path={`${path}/outcometypes/:appSiteId`} component={OutcomeTypeList} />            
            <Route path={`${path}/edit/:appSiteId/:siteSurveyId`} component={SiteSurveyDetail} />            
            <Route path={`${path}/:appSiteId`} component={SiteSurveyList} />            
        </Switch>
    );
}

export { SiteSurveys };