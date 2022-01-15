import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SiteProductList } from './SiteProductList';
import { SiteProductDetail } from './SiteProductDetail';

function SiteProducts({ match }) {
    const { path } = match;
    
    return (
        <Switch>            
            <Route path={`${path}/edit/:appSiteId/:siteProductId`} component={SiteProductDetail} />            
            <Route path={`${path}/:appSiteId`} component={SiteProductList} />            
        </Switch>
    );
}

export { SiteProducts };