import React from 'react';
import Redirect from "react-router-dom";
import { Link } from "react-router-dom";//{Link}

import { ProductViewer } from "./product_viewer.jsx";
import { ErrorPage } from "../error_page.jsx";

import { GetAjaxMessageForRender } from '../common/get_ajax_message_for_render.jsx';
import LinkBtn from "../common/link_btn.jsx"
import { TO_BASE, TO_ROOT, AJAX_BASE, TO_ADD } from "../common/standart_link_adress.jsx";
import { withRouter } from "react-router-dom";
import { Input } from "../edite_product_base/validated_form.jsx";

const _productTableHeader = {
    id: null,
    name: "Название товара",
    expandMore: "Описание товара",
    price: "Цена"
}

export default class BaseViewer extends React.Component {
    constructor(props) {
        super(props);
    }
    //проверка и отображение ajax-сообщения с данными станицы просмотра базы данных
    _renderPage(ajaxMessage) {
        return <BasePageViewer ajaxMessage={ajaxMessage}/>
    }

    render() {
        var requestPath = window.location.pathname.replace(TO_ROOT, AJAX_BASE+"/");
        var requestURL = "https://" + window.location.host + requestPath;
        return <GetAjaxMessageForRender requestUrl={requestURL} renderMethod={this._renderPage} />;
    }
}

const BasePageViewer = (props) => {

    var sortType = props.ajaxMessage._sortType;
    var _entries = props.ajaxMessage._entries;
    var pages = Array(props.ajaxMessage._pageCount);
    for (var i = 0; i < pages.length; i++)
        pages[i] = i + 1;

    var tableBody = (<tbody><tr><td>Table is empty</td></tr></tbody>);

    if (_entries == null || _entries.length == 0) {
        if (pages != 0)
            return <ErrorPage code="404" text="Not found" />
    }
    else {
        tableBody = (<tbody>
            {_entries.map((currentEntrie) => (
                <ProductViewer key={currentEntrie.id} entrie={currentEntrie} useEdite={true} useID={true} />
            ))}


        </tbody>);
    }

    return (
        <div className="panel-body">
            <h1 key="h1">All products.<br></br></h1>
            <SearchForm/>

            <LinkBtn key="add" to={TO_ADD} text="Add new product." />

            <table key="table" className="table table-striped table-condensed">
                <thead>
                    <tr>
                        <td>Id</td>
                        <td>{_productTableHeader.name + " "} <LinkForSort key="name" sortFor="name" sortType={sortType} /></td>
                        <td>{_productTableHeader.price + " "} <LinkForSort key="price" sortFor="price" sortType={sortType} /></td>
                    </tr>
                </thead>
                {tableBody}
            </table>

            <ul className="hr">
                {pages.map((pageNum) => {
                var link = "/" + pageNum + window.location.search;
                    return (<li key={link}><Link to={link}>{pageNum}</Link>, </li>);
                })}
            </ul>
        </div>
    );
}

class SearchForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchName: this.getQueryVariable("searchName"),
            minPrice: this.getQueryVariable("minPrice"),
            maxPrice: this.getQueryVariable("maxPrice"),

            formErrors: "",
            formValod: true
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.sendSearchQuerry = this.sendSearchQuerry.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return "";
    }
    
    handleUserInput = (e) => {
        const name = e.target.name;
        var value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateForm(name, value) });
    }

    validateForm() {
        if (this.state.minPrice > this.state.maxPrice) {
            this.setState({ formErrors: "min price is greather then max price" });
            this.state.formValod = false;
        }
        else if (this.state.minPrice < -1 || this.state.maxPrice < -1) {
            this.setState({ formErrors: "min price and max price out of range" });
            this.state.formValod = false;
        }
        else {
            this.setState({ formErrors: "" });
            this.state.formValod = true;
        }
    }

    sendSearchQuerry() {
        var querryString = ""
        if (this.state.searchName != "")
            querryString += "?searchName=" + this.state.searchName;
        if (this.state.minPrice != "")
            querryString += "?minPrice=" + this.state.minPrice;
        if (this.state.maxPrice != "")
            querryString += "?maxPrice=" + this.state.maxPrice;
        if (window.location.search != querryString)
            this.props.history.push(TO_BASE + querryString);
    }

    render() {
        var sta = this.state;
        return (<details>
            <h3>Поиск</h3>
            <form className="form-container" onSubmit={this.sendSearchQuerry}>
                <Input name="searchName" type="text" value={sta.searchName} title="Name"
                    placeholder={"name"} handleChange={this.handleUserInput} />
                <Input name="minPrice" type="number" value={sta.minPrice} title="Min price(set -1 for default value)"
                    placeholder={"min price"} handleChange={this.handleUserInput} />
                <Input name="maxPrice" type="number" value={sta.maxPrice} title="Max price(set -1 for default value)"
                    placeholder={"max price"} handleChange={this.handleUserInput} />

                <Input name="search" type="submit" value="Seapch" />
            </form>
        </details>);
    }
}


const LinkForSort = (props)=> {
    var isInvertOrder;
    var sortFor = props.sortFor;
    if (props.sortType.startsWith(sortFor))
        isInvertOrder = props.sortType == sortFor;
    else
        isInvertOrder = false;
    var orderArrow = isInvertOrder ? "⯅" : "⯆";
    if (isInvertOrder)
        sortFor += "Desc";
    return (<Link to={TO_BASE+"?sortType=" + encodeURIComponent(sortFor)}>{orderArrow}</Link>);
}