import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Role } from '../_helpers';
import { accountService } from '../_services';
import { MainNav, PrivateRoute, Alert } from '../_components';
import { Home } from '../Home/Index';
import { Profile } from '../Profile/Index';
import { Admin } from '../Admin/Index';
import { Account } from '../Account/Index';

// const Nav = lazy(() => import('../_components/Nav'));
// const PrivateRoute = lazy(() => import('../_components/PrivateRoute'));
// const Alert = lazy(() => import('../_components/Alert'));
// const Home = lazy(() => import('../Home/Index'));
// const Profile = lazy(() => import('../Profile/Index'));
// const Admin = lazy(() => import('../Admin/Index'));
// const Account = lazy(() => import('../Account/Index'));
// const renderLoader = () => <p>Loading...</p>;

//  const NavContainer = () => (
//      <Suspense fallback={renderLoader()}>
//          <Nav />
//      </Suspense>
//  );

function App() {
    const { pathname } = useLocation();  
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    return (
        <div className={'app-container' + (user && ' bg-light')}>
            <MainNav />
            <Alert />
            <Switch>
                <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />                
                <Route path="/account" component={Account} />
                <Redirect from="*" to="/" />
            </Switch>
        </div>
    );
}

export { App }; 