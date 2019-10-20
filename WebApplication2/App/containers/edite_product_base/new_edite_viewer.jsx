import React from 'react';
import Redirect from "react-router-dom";

import { Link } from "react-router-dom";//{Link}

import { ErrorPage } from "../error_page.jsx";

import { GetAjaxMessageForRender } from '../common/get_ajax_message_for_render.jsx';
import { ValidatedForm } from "./validated_form.jsx";
import { AutoryseBase } from '../autoryse/autoryse_base.jsx';
import { TO_EDITE, AJAX_DETAILS, AJAX_EDITE } from "../common/standart_link_adress.jsx";

export default class EditeProductViewer extends React.Component {
    constructor(props) {
        super(props);
        this._renderForm = this._renderForm.bind(this);
    }

    //проверка и отображение ajax-сообщения с данными станицы просмотра базы данных
    _renderForm(ajaxMessage) {
        return <ValidatedForm header="Редактирование записи товара"
            submitAdress={this._submitAdress}
            ajaxMessage={ajaxMessage} />
    }

    render() {
        var requestPath = window.location.pathname.replace(TO_EDITE, AJAX_EDITE);
        this._submitAdress = "https://" + window.location.host + requestPath;
        var getAjaxAdress = this._submitAdress.replace(AJAX_EDITE, AJAX_DETAILS)
        var baseViewer = (<GetAjaxMessageForRender requestUrl={getAjaxAdress} renderMethod={this._renderForm} />);       
        var autoryseBase = (<AutoryseBase viewer={baseViewer} />);
        return autoryseBase;
    }
}