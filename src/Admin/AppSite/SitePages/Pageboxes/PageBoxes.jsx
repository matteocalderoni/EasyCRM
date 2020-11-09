import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PageBoxList } from './PageBoxList';
import { PageBoxDetail } from './PageBoxDetail';

function PageBoxes({ match }) {
    const { path } = match;
    
    return (
        <Switch>            
            <Route path={`${path}/edit/:appSiteId/:pageId/:boxId`} component={PageBoxDetail} />
            <Route path={`${path}/:appSiteId/:pageId`} component={PageBoxList} />
        </Switch>
    );
}

export { PageBoxes };