import { createStore, combineReducers, applyMiddleware, compose, AnyAction } from 'redux'
import { createBrowserHistory } from 'history';
import { RouterState, connectRouter, routerMiddleware } from 'connected-react-router';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk'
import { AdminState, adminReducer } from './redux/admin/reducer';
import { userReducer, UserState } from './redux/user/reducer';
import { campaignReducer, CampaignState } from './redux/campaign/reducer';


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    }
}

export type RootAction = AnyAction;

export type ThunkDispatch = OldThunkDispatch<RootState, null, RootAction>;

export const history = createBrowserHistory();

export interface RootState {
    router: RouterState;
    user: UserState;
    admin: AdminState;
    campaign: CampaignState;
}

const reducer = combineReducers<RootState>({
    router: connectRouter(history),
    user: userReducer,
    admin: adminReducer,
    campaign: campaignReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(thunk),
        applyMiddleware(routerMiddleware(history)))
);