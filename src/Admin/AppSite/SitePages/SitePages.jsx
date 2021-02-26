import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SitePageNav } from './SitePageNav';
import { SitePageDetail } from './SitePageDetail';
import { PageBoxes } from './Pageboxes'

function SitePages({ match }) {
    const { path } = match;
    
    return (
        <Switch>            
            <Route path={`${path}/pageboxes`} component={PageBoxes} />
            <Route path={`${path}/edit/:appSiteId/:pageId`} component={SitePageDetail} />            
            <Route path={`${path}/:appSiteId`} component={SitePageNav} />            
        </Switch>
    );
}

export { SitePages };