import React from 'react';
import { Redirect } from "react-router-dom";
import { FormErrors } from '../common/form_errors.jsx';
import { ErrorPage } from '../error_page.jsx';

export const AutoryseBase = (props) => {
    var access_token = GetTokenFromStorage();
    if (access_token == null) {
        window.localStorage.removeItem("product_jwt")
        if (window.location.pathname + window.location.search == "/login?redirectPath=/login")
            throw Error("ring redirect");
        return (<Redirect to={"/login?redirectPath=" + window.location.pathname} />);
    }
    return props.viewer;
}


//import './Form.css';

export class AutorisationViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            formErrors: { userName: '', password: '' },
            userNameValid: false,
            passwordValid: false,
            formValid: false
        }
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let userNameValid = this.state.userNameValid;
        let passwordValid = this.state.passwordValid;

        switch (fieldName) {
            case 'userName':
                userNameValid = value.match(/^[a-zA-Z'][a-zA-Z' ]+[a-zA-Z']?$/); // валидация адреса: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
                fieldValidationErrors.userName = userNameValid ? '' : ' is invalid. UserName must contain only English characters';
                break;
            case 'password':
                passwordValid = value.length >= 5;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short. Password myst cotains 5 characters';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            userNameValid: userNameValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.userNameValid && this.state.passwordValid });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        var st = this.state;

        return (
            <div className="panel-body">
            <form className="centerBlock, form-container, whiteText">
                <h2>Login</h2>
                <div className="inlineBlock, centerBlock">
                    <FormErrors formErrors={st.formErrors} />
                </div>
                <div className={`form-group ${this.errorClass(st.formErrors.userName)}` + ", inlineBlock, centerBlock"}>
                    <label htmlFor="userName">User name</label>
                    <input type="userName" required className="form-control" name="userName"
                        placeholder="UserName"
                        value={st.userName}
                        onChange={this.handleUserInput} />
                </div>
                <div className={`form-group ${this.errorClass(st.formErrors.password)}` + ", inlineBlock, centerBlock"}>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleUserInput} />
                </div>
                <div className=" centerBlock">
                    <button type="submit" className="btn btn-primary, inlineBlock" onClick={
                        (event) => {
                            event.preventDefault();
                            var requestStatus = this.sendAutorisationRequest(st.userName, st.password);
                            if (requestStatus == 200) {
                                var link = window.location.href;
                                link = link.split("redirectPath=");
                                link = link[1];
                                if (link != null)
                                    this.props.history.push(link);
                                else
                                    this.props.history.push("/base/1");
                            }
                            else alert("Ошибка авторизации, код " + requestStatus);
                        }
                    } disabled={!this.state.formValid}>Login!</button>
                    </div>
                </form>
                </div>
        )
    }

    sendAutorisationRequest(userName, password) {
        var paramNames = new Array("userName", "password");
        var paramValues = new Array(userName, password);
        var requestURL = "https://" + window.location.host + "/login/signin";
        var request = sendHttpRequest(requestURL, "POST", paramNames, paramValues, null);
        if (request.status == 200) {
            try {
                var jsonJWT = JSON.parse(request.responseText);
                if (jsonJWT.access_token != undefined) {
                    window.localStorage.setItem("product_jwt", request.responseText);
                    return 200;
                }
            }
            catch (e) {
                return 400;
            }
        }
        return request.status;
    }
}

export const sendAutorysedPostRequest = (requestURL, paramNames, paramValues) => {
    var access_token = GetTokenFromStorage();
    return sendHttpRequest(requestURL, "POST", paramNames, paramValues, access_token)
}

export const ExequteRequestResult = (request) => {
    switch (request.status) {
        case 201:
        case 200:
            if (request.responseText != null) {
                try {
                    return ({
                        requestObj: JSON.parse(request.responseText)
                    });
                }
                catch (e) {
                }
            }
            return ({
                statusCode: 400,
                alert: "invalide submit adress, or request type!"
            });
        case 401:
            return ({
                redirectTo: "/login?redirectPath=" + window.location.pathname
            });
        case 400:
            return ({
                statusCode: 400,
                alert: "invalide submit adress, or request type!"
            });

        default:
            if (request.responseText != "") {
                return ({
                    jsonException: request.responseText
                });
            }
            else {
                return ({
                    ErrorMessage: request.statusText
                });
            }
    }
}

export const ExequteGetRequest = (props) => {
    if (props.exequtedRequest.requestObj != undefined) {
        return props.viewer(props.exequtedRequest.requestObj);
    }
    if (props.exequtedRequest.alert != undefined)
        return <ErrorPage errorCode={props.exequtedRequest.statusCode} errorMessage={props.exequtedRequest.alert} />;
    if (props.exequtedRequest.jsonException != undefined)
        return <r2/>;
}

export const sendAutorysedHttpRequest = (requestURL, requestType, paramNames, paramValues) => {
    var access_token = GetTokenFromStorage();
    return sendHttpRequest(requestURL, requestType, paramNames, paramValues, access_token)
}

export const sendHttpRequest = (requestURL, requestType, paramNames, paramValues, access_token) => {
    var querry = window.location.search;
    var request = new XMLHttpRequest();
    if (querry != null)
        request.open(requestType, requestURL + querry, false);
    
    else
        request.open(requestType, requestURL, false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    if (access_token != null)
        request.setRequestHeader('Authorization', 'Bearer ' + access_token);

    var body;
    if (paramNames != null && paramValues != null) {
        if (requestType != "POST" && requestType != "PUT") {

        }
        if (paramNames.length != paramValues.length)
            throw Error("invalide body");
        if (paramNames.length != 0) {
            body = paramNames[0] + "=" + encodeURIComponent(paramValues[0]);
            for (var i = 1; i < paramNames.length; i++) {
                body += "&" + paramNames[i] + "=" + encodeURIComponent(paramValues[i]);
            }
        }
        request.send(body);
    }
    else {
        if (LOGIC_XOR(paramNames != null, paramValues != null) || (requestType != "GET" && requestType != "DELETE"))
            throw Error("invalide request");
        request.send();
    }
    return request;
}

export const GetTokenFromStorage = () => {
    var access_token = null;
    var tokenJWT = window.localStorage.getItem("product_jwt");
    if (tokenJWT != null) {
        try {
            var tokenObj = JSON.parse(tokenJWT);
            if (Date.parse(tokenObj.validity_period) > Date.now())
                access_token = tokenObj.access_token;
        }
        catch (e) {
            access_token = null;
        }
    }
    return access_token;
}

const LOGIC_XOR = (a, b) => { return (a && !a) || (!a && a); }