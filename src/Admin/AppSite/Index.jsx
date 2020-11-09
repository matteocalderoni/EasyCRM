import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { SitePages } from './SitePages';

function AppSites({ match }) {
    const { path } = match;
    
    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/add`} component={AddEdit} />
            <Route path={`${path}/edit/:appSiteId`} component={AddEdit} />
            <Route path={`${path}/sitepages`} component={SitePages} />
        </Switch>
    );
}

export { AppSites };