import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { SiteOrderList } from './SiteOrderList';
import { SiteOrderDetail } from './SiteOrderDetail';

function SiteOrders({ match }) {
    const { path } = match;
    
    return (
        <Switch>            
            <Route path={`${path}/edit/:appSiteId/:orderYear/:orderId/:registryId`} component={SiteOrderDetail} />            
            <Route path={`${path}/:appSiteId`} component={SiteOrderList} />            
        </Switch>
    );
}

export { SiteOrders };