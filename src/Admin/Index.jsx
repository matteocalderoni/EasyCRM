import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Role } from '../_helpers';
//import { accountService } from '../_services';
import { PrivateRoute } from '../_components';
import { Overview } from './Overview';
import { Users } from './Users/Index';
import { AppSites } from './AppSite/Index';

function Admin({ match }) {
    const { path } = match;
    //const [user, setUser] = useState({});

    // useEffect(() => {
    //     accountService.user.subscribe(x => setUser(x));        
    // }, []);

    return (
        <div className="p-4">
            <div className="container-fluid mb-5">
                <Switch>
                    <Route exact path={path} component={Overview} />                    
                    <PrivateRoute path={`${path}/users`} roles={[Role.Admin]} component={Users} />
                    <PrivateRoute path={`${path}/sites`} component={AppSites} />
                </Switch>
            </div>
        </div>
    );
}

export { Admin };