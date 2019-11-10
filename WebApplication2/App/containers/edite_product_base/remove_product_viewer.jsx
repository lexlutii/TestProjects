import React from 'react';
import { GetAjaxMessageForRender } from '../common/get_ajax_message_for_render.jsx';
import { AutoryseBase } from "../autoryse/autoryse_base.jsx";
import { sendAutorysedHttpRequest } from "../autoryse/autoryse_base";
import { RenderProductDetails } from "../base/product_viewer.jsx";
import { _productTableHeader, ExceptionPage } from "./validated_form.jsx";
import { Redirect } from 'react-router-dom';
import { TO_BASE, TO_LOGIN, TO_REMOVE, AJAX_DETAILS, AJAX_REMOVE } from "../common/standart_link_adress.jsx";
import LinkBtn from "../common/link_btn.jsx";



export default class DeleteProductViewer extends React.Component {
    constructor(props) {
        super(props);
        this._renderForm = this._renderForm.bind(this);
    }

    _renderForm(ajaxMessage) {
        this.requestPath = this.requestPath.replace(AJAX_DETAILS, AJAX_REMOVE);
        return <RemoveForm submitAdress={this.requestPath}
            ajaxMessage={ajaxMessage} />
    }

    render() {
        this.requestPath = window.location.pathname.replace(TO_REMOVE, AJAX_DETAILS);
        this.requestPath = "https://" + window.location.host + this.requestPath;
        var baseViewer = (<GetAjaxMessageForRender requestUrl={this.requestPath} renderMethod={this._renderForm} />);
        var autoryseBase = (<AutoryseBase viewer={baseViewer} />);
        return autoryseBase;
    }
}

class RemoveForm extends React.Component {
    constructor(props) {
        super(props)
        this._entrieToRemove = props.ajaxMessage;
        this._submitAdress = props.submitAdress;
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {};
    }

    handleFormSubmit() {
        event.preventDefault();
        var request = sendAutorysedHttpRequest(this._submitAdress, "DELETE", null, null);
        switch (request.status) {
            case 201:
            case 200:
                if (request.responseText != "")
                    alert("invalide submit adress, or request type!");

                this.setState({
                    redirectTo: TO_BASE
                });
                break;
            case 401:
                this.setState({
                    redirectTo: TO_LOGIN+"?redirectPath=" + window.location.pathname
                });
                break;
            case 400:
                alert("invalide form");
                break;
            default:
                if (request.responseText != "") {
                    this.setState({
                        jsonException: request.responseText
                    });
                }
                else
                    alert("Error " + + request.statusText);
                break;
        }
    }

    render() {

        if (this.state.jsonException != undefined)
            return (<ExceptionPage jsonException={this.state.jsonException} previosPage={window.location.href} />);
        if (this.state.redirectTo != undefined)
            return (<Redirect to={this.state.redirectTo} />);

        var removeProductChild = (
            <div>
                <form className="form-container" onSubmit={this.handleFormSubmit}>>
                <h3>Delete the entry:</h3>
                    <RenderProductDetails entrie={this._entrieToRemove} useEdite={false} />
                    <h2>Are you sure you want to delete this entry?</h2>
                    <div className="centerBlock">
                        <LinkBtn key="cancel" to={TO_BASE} text="Cancel" />
                        <input type="submit" id="remove" value="Delete" className="form-submit" />
                    </div>

                </form></div>);

        return removeProductChild;
    }
}