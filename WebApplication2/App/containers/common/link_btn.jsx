import React from 'react';
import { Redirect } from 'react-router';

export default class LinkBtn extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
        this.state = { redirect: false };
    }

    handleOnClick(){
        this.setState({ redirect: true });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.props.to} />;
        }
        return <button onClick={this.handleOnClick} type="button">{this.props.text}</button>;
    }
}