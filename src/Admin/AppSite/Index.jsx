import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { SitePages } from './SitePages';
import { SiteLanguages } from './SiteLanguages';

function AppSites({ match }) {
    const { path } = match;
    
    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/add`} component={AddEdit} />
            <Route path={`${path}/edit/:appSiteId`} component={AddEdit} />
            <Route path={`${path}/sitepages`} component={SitePages} />
            <Route path={`${path}/sitelanguages`} component={SiteLanguages} />
        </Switch>
    );
}

export { AppSites };