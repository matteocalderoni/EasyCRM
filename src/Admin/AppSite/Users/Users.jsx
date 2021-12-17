import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserList } from './UserList';
import { UserDetail } from './UserDetail';

function Users({ match }) {
    const { path } = match;
    
    return (
        <Switch>            
            <Route path={`${path}/edit/:appSiteId/:id`} component={UserDetail} />            
            <Route path={`${path}/:appSiteId`} component={UserList} />            
        </Switch>
    );
}

export { Users };