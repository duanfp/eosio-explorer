/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';
import apiPostgres from '../services/api-postgres';
import { errorLog } from '../helpers/error-logger';
import paramsToQuery from '../helpers/params-to-query';
// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `endpoint/`;

//Action Type
export const CONNECT_START = actionPrefix + `CONNECT_START`;
const CONNECT_FULFILLED = actionPrefix + `CONNECT_FULFILLED`;

//Action Creator
export const connectStart = (nodeos) => ({ type: CONNECT_START, nodeos });
export const connectFulfilled = payload => ({ type: CONNECT_FULFILLED, payload });

// Epic
const connectEpic = ( action$, state$ ) => action$.pipe(
  ofType(CONNECT_START),
  mergeMap(action =>{
    let query = paramsToQuery({ port: process.env.REACT_APP_POSTGRES_DB_PORT });
    return apiPostgres(`connectToDB${query}`).pipe(
      map(res => {
        return connectFulfilled(action.nodeos)}),
      catchError(error => {
        errorLog("Manage accounts page/ get all permissions error",error);
        return of(connectFulfilled(action.nodeos))
      })
    )}
  )
);


export const combinedEpic = combineEpics(
  connectEpic
);

//Reducer
let hostname = window.location.hostname;
export const pathInitState = {
  nodeos: `http://47.107.138.103:8888`
}

const pathReducer = (state=pathInitState, action) => {
  switch (action.type) {
    case CONNECT_START:
      return {
        nodeos: action.nodeos
      };
    case CONNECT_FULFILLED:
      return {
        nodeos: state.nodeos
      };
    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  path: pathReducer
});
