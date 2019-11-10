import React from "react";
import { sendAutorysedPostRequest } from "../autoryse/autoryse_base";
import { Redirect, Link } from 'react-router-dom';
import { TO_BASE, TO_LOGIN } from "../common/standart_link_adress.jsx";


import { ExceptionPage } from "..\/error_page.jsx";

import "react-datepicker/dist/react-datepicker.css";

export const _productTableHeader = {
    id: null,
    name: "Product name",
    description: "Product description",
    price: "Price"
}

export class ValidatedForm extends React.Component {
    constructor(props) {
        super(props);

        this._header = props.header;
        this._submitAdress = props.submitAdress;

        this.state = {
            name: '',
            description: '',
            price: '',

            formErrors: {
                name: '',
                description: '',
                price: '',
            },

            nameValid: false,
            descriptionValid: false,
            priceValid: false,

            formValid: false
        }

        if (props.ajaxMessage != null) {
            this.state.name = props.ajaxMessage.name;
            this.state.description = props.ajaxMessage.description;
            this.state.price = props.ajaxMessage.price;
        }

        this._placeholder = {
            id: null,
            name: "name",
            description: "description",
            price: "price"
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        var value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let nameValid = this.state.nameValid;
        let descriptionValid = this.state.descriptionValid;
        let priceValid = this.state.priceValid;

        switch (fieldName) {
            case "name":
                nameValid = value != null && value != "";
                fieldValidationErrors.name = nameValid ? '' : ' is empty';
                break;
            case 'description':
                descriptionValid = value != null && value != "";
                fieldValidationErrors.description = descriptionValid ? '' : ' is empty';
                break;
            case "price":
                priceValid = false;
                if (value.match(/^[-\+]?\d+/) === null)
                    fieldValidationErrors.price = "is not a number";
                else if (value % 1 != 0)
                    fieldValidationErrors.price = "is not a integer number";
                else if (value <= 0)
                    fieldValidationErrors.price = ' is not a positive number';
                else {
                    priceValid = true;
                    fieldValidationErrors.price = ''
                }
            default:
                break;
        }

        this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
            descriptionValid: descriptionValid,
            priceValid: priceValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid:
                this.state.nameValid &&
                this.state.descriptionValid &&
                this.state.priceValid
        });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    sendFormRequest(sta, submitAdress) {
        var paramNames = new Array("name", "description", "price");

        var paramValues = new Array(sta.name, sta.description, sta.price);
        return sendAutorysedPostRequest(submitAdress, paramNames, paramValues)
    }

    handleFormSubmit(event) {
        event.preventDefault();
        var request = this.sendFormRequest(this.state, this._submitAdress);
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
                    redirectTo: TO_LOGIN + "?redirectPath=" + window.location.pathname
                });
                break;
            case 400:
            case 452:
                alert("invalide form data");
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

    handleCancel() {
        this.setState({
            redirectTo: TO_BASE
        });
    }

    render() {
        if (this.state.jsonException != undefined)
            return (<ExceptionPage jsonException={this.state.jsonException} previosPage={window.location.href} />);
        if (this.state.redirectTo != undefined)
            return (<Redirect to={this.state.redirectTo} />);
        var ste = this.state;
        var ph = this._placeholder;
        var handInput = this.handleUserInput;
        return (
            <div className="whiteText">
                <form className="form-container" onSubmit={this.handleFormSubmit}>
                    <fieldset>
                        <legend>{this._header}</legend>
                        <Input name="name" type="text" value={ste.name} title={_productTableHeader.name}
                            placeholder={ph.name} handleChange={handInput} required />
                        <Input name="description" type="text" value={ste.description} title={_productTableHeader.description}
                            placeholder={ph.description} handleChange={handInput} required />
                        <Input name="price" type="number" value={ste.price} title={_productTableHeader.price}
                            placeholder={ph.price} handleChange={handInput} required />
                    </fieldset>
                    <div className="centerBlock">
                        <Input name="save" type="submit" value="Save" required />
                        <button onClick={this.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

export const Input = (props) => {
    var required = false;
    if (props.required != undefined)
        required = true;
    var className = props.type == "submit" ? "form-submit" : "form-input";

    return (
        <label htmlFor={props.name} className="form-label">{props.title}
            <br />
            <input
                id={props.name}
                name={props.name}
                type={props.type}
                className={className}
                value={props.value}
                onChange={props.handleChange}
                placeholder={props.placeholder}
                required={required}
            /><br />
        </label>
    );
}