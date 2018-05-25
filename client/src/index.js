//这个主页用来处理所有的data layer
import React from "react";
import ReactDOM from "react-dom";
import "materialize-css/dist/css/materialize.min.css";
import App from "./components/App.js";
import {Provider} from "react-redux"; //react-redux 是 redux 和react的粘合剂
import {createStore,applyMiddleware} from 'redux';
import reduxThunk from "redux-thunk";//reduxThunk 这个中间件会监视所有上传的action，如果 action不是一个object而是一个function, 那么reduxThunk会传入dispatcher()函数给这个function作为参数，并运行这个function
import reducers from "./reducers";
import axios from 'axios';
window.axios = axios;

const store = createStore(reducers,{},applyMiddleware(reduxThunk)); // (reducer + initial state)
ReactDOM.render(
    <Provider store={store}><App /></Provider>, document.querySelector("#root"));

console.log("Stripe key is "+process.env.REACT_APP_STRIPE_KEY);
console.log("Node_env is "+process.env.NODE_ENV);