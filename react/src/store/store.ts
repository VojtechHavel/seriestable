import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";
import {loadState} from "../utils/localStorage";

const middleware = [thunk];

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function findGetParameter(parameterName) {
    let result:string | null = null;
    let tmp:string[] = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach((item) =>{
            tmp = item.split("=");
            if (tmp[0] === parameterName) {result = decodeURIComponent(tmp[1])};
        });
    return result;
}

function configureStore() {

    let newStore;

    if (findGetParameter('signup-token')) {
        console.log("apiToken true");
        const persistedState = loadState();

        newStore = createStore(rootReducer, persistedState, composeEnhancers(
            applyMiddleware(...middleware)
        ));


        console.log("store", JSON.stringify(newStore));
    } else {
        newStore = createStore(rootReducer, composeEnhancers(
            applyMiddleware(...middleware)
        ));
    }

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./rootReducer', () => {
                newStore.replaceReducer(require("./rootReducer").default)
        });
    }

    return newStore;
}

const store = configureStore();

export default store;