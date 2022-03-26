import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SiteProductTypeList } from './SiteProductTypeList';
import { SiteProductTypeDetail } from './SiteProductTypeDetail';

function SiteProductTypes({ match }) {
    const { path } = match;
    
    return (
        <Switch>            
            <Route path={`${path}/edit/:appSiteId/:siteProductTypeId`} component={SiteProductTypeDetail} />            
            <Route path={`${path}/:appSiteId`} component={SiteProductTypeList} />            
        </Switch>
    );
}

export { SiteProductTypes };