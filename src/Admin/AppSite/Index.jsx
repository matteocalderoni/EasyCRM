import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { SitePages } from './SitePages';
import { SiteLanguages } from './SiteLanguages';
import { SiteSurveys } from './SiteSurvey'
import { SiteProducts } from './SiteProduct'
import { SiteOrders } from './SiteOrder'
import { Users } from './Users';

function AppSites({ match }) {
    const { path } = match;
    
    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/add`} component={AddEdit} />
            <Route path={`${path}/edit/:appSiteId`} component={AddEdit} />
            <Route path={`${path}/sitepages`} component={SitePages} />
            <Route path={`${path}/sitelanguages`} component={SiteLanguages} />
            <Route path={`${path}/sitesurveys`} component={SiteSurveys} />
            <Route path={`${path}/siteproducts`} component={SiteProducts} />
            <Route path={`${path}/siteorders`} component={SiteOrders} />
            <Route path={`${path}/users`} component={Users} />
        </Switch>
    );
}

export { AppSites };