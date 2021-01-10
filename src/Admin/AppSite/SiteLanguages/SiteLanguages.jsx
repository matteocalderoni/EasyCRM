import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SiteLanguageList } from './SiteLanguageList';
import { SiteLanguageDetail } from './SiteLanguageDetail';

function SiteLanguages({ match }) {
    const { path } = match;
    
    return (
        <Switch>                                       
            <Route path={`${path}/edit/:appSiteId/:code`} component={SiteLanguageDetail} />            
            <Route path={`${path}/:appSiteId`} component={SiteLanguageList} />            
        </Switch>
    );
}

export { SiteLanguages };