import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

import { history } from './_helpers';
import { accountService } from './_services';
import { App } from './App/Index';

import './index.css';
//import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// const App = lazy(() => import('./App/Index'));
// const renderLoader = () => <p>Loading...</p>;

//  const AppContainer = () => (
//      <Suspense fallback={renderLoader()}>
//          <App />
//      </Suspense>
//  );

// attempt silent token refresh before startup
accountService.refreshToken().finally(startApp);

function startApp() { 
//  ReactDOM.render(
//    <Router history={history}>
//     <App />
//    </Router>,
//    document.getElementById('root')
//  ); 

   render(
       <Router history={history}>
           <App />
       </Router>,
       document.getElementById('root')
   );

  //serviceWorker.register();
}

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
