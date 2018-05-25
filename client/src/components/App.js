import React,{Component} from "react";
import {BrowserRouter,Route} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import Header from "./Headers";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import SurveyNew from './surveys/SurveyNew';

//BrowserRouter 只能有一个child
//Route 中的exact表示必须精确匹配，否则只要当前URL中包含path ，这个Route 下的component就会显示
//BrowserRouter 和 Route 与普通的react component是一样的，只是react-router-dom这个第三方包使用了这两个component来管理路由
class App extends Component{
    componentDidMount(){
        this.props.fetchUser();
    }
    render() {
        return (
            <BrowserRouter>
                <div className='container'>
                        <div>
                            <Header/>
                            <Route exact path='/' component={Landing}/>
                            <Route exact path='/surveys' component={Dashboard}/>
                            <Route path='/surveys/new' component={SurveyNew}/>
                        </div>
                </div>
            </BrowserRouter>
        );
    }
};

export default connect(null,actions)(App);