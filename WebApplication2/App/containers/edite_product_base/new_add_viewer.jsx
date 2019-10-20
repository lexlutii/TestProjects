import React from 'react';
import Redirect from "react-router-dom";
import { ValidatedForm } from "./validated_form.jsx";
import { AutoryseBase } from '../autoryse/autoryse_base.jsx';
import { AJAX_NEW_PRODUCT } from "../common/standart_link_adress.jsx";

export const AddProductViewer = () => {
    var submitAdress = "https://" + window.location.host + AJAX_NEW_PRODUCT;
    var viewer = <ValidatedForm header="Добавление записи товара"
        submitAdress = {submitAdress} />;
    var autoryseBase = (<AutoryseBase viewer={viewer} />);
    return autoryseBase;
}