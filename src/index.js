import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import App from './App';
import './index.css';
import reducers from './reducers/index';

const browserHistory = createHistory();

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
