import {createStore, applyMiddleware, compose} from 'redux';
import initSubscriber from 'redux-subscriber';
import reduxReset from 'redux-reset';
import thunk from 'redux-thunk';

import rootReducer from './reducer';

const middleware = applyMiddleware(thunk);
let composeEnhancers = compose;

if (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

const enHanceCreateStore = composeEnhancers(
  middleware,
  reduxReset(), // Will use 'RESET' as default action.type to trigger reset
)(createStore);

// // ------------- these are the actions -------------
export * from './reducer';

// ------------- this is our store -------------
// export default store;
export default () => {
  let store = enHanceCreateStore(rootReducer);
  initSubscriber(store);
  return store;
};
