import React,{Component} from 'react';
import StripeCheckout from "react-stripe-checkout";
import {connect} from "react-redux";
import * as actions from "../actions";
class Payments extends Component {
    render(){
        return(
            <StripeCheckout
            name="emaily"
            description="5$ for 5 email credits"
            amount={500}
            token={token=>this.props.handleToken(token)}
            stripeKey={process.env.REACT_APP_STRIPE_KEY}>
                <button className="btn">Buy Credit</button>
            </StripeCheckout>
        )
    }
}
function mapDispatchToProps(dispatch){
    return ({
        handleToken:actions.handleToken
    });

}

export default connect(null,actions)(Payments);