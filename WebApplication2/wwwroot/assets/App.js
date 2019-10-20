"use strict";

const domContainer = document.querySelector('#jsxreactdiv');
const e = React.createElement;
const basePath = "/employee/base/1";
var StartPage = window.location.host + basePath;
var token = null;
var tokenLifeTime = Date.now() - 1;
var strURL = window.pathname;
document.body.style.backgroundColor = 'white';
var nextPath = null;
var path = window.location.pathname;
const _employeeTableHeader = {
    id: null,
    name: "Имя сотрудника",
    email: "Адрес электронной почты",
    birthday: "День рождения",
    salary: "Зарплата"
};

class BtnLink extends React.Component {
    constructor(props) {
        super(props);
        this._href = props.href;
        this._text = props.text;
    }

    render() {
        return React.createElement("button", {
            className: "ajaxBtnLink",
            onClick: () => {
                path = this._href;
                window.onDocumentUpdate();
            }
        }, this._text);
    }

}

class EmployeeViewer extends React.Component {
    constructor(props) {
        super(props);
        this._entrie = props.entrie;
        this._useID = props.useID;
        this._useEdite = props.useEdite;
    }

    render() {
        var tdId = null;
        if (this._useID) tdId = React.createElement("td", null, "ID");
        var tdEdite = null;
        var tdRemove = null;

        if (this._useEdite) {
            tdEdite = React.createElement("td", null, React.createElement(BtnLink, {
                href: "/employee/" + this._entrie.id,
                text: "edite"
            }));
            tdRemove = React.createElement("td", null, React.createElement(BtnLink, {
                href: "/employee/remove/" + this._entrie.id,
                text: "remove"
            }));
        }

        return React.createElement("tr", {
            id: this._entrie.id
        }, tdId, React.createElement("td", null, this._entrie.name), React.createElement("td", null, this._entrie.email), React.createElement("td", null, this._entrie.birthday), React.createElement("td", null, this._entrie.salary), tdEdite, tdRemove);
    }

}

class EditeViewer extends EmployeeViewer {
    constructor(props) {
        super(props);
        this._header = props.header;
        this._entrie = props.entrie;
        this._submitAdress = props.submitAdress;
        this._submitMessage = props.submitMessage;
    }

    render() {
        return React.createElement("div", null, React.createElement("form", null, React.createElement("input", {
            type: "text",
            name: _employeeTableHeader.name,
            value: _entrie.name
        }), React.createElement("input", {
            type: "email",
            name: _employeeTableHeader.email,
            value: _entrie.email
        }), React.createElement("input", {
            type: "date",
            name: _employeeTableHeader.birthday,
            value: _entrie.birthday
        }), React.createElement("input", {
            type: "number",
            name: _employeeTableHeader.salary,
            value: _entrie.salary
        }), React.createElement("input", {
            type: "submit",
            onSubmit: function () { },
            value: this._submitMessage
        }), React.createElement("input", {
            type: "button",
            onClick: function () { },
            value: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C"
        })));
    }

}

class EditeEmployeeViewer extends EditeViewer {
    constructor(props) {
        props.header = "Редактирование записи сотрудника";
        props.submitAdress = window.location.host + "/employee/ajax/" + entrieToEdite.id;
        props.submitMessage = "Подтвердить изменение записи";
        super(props);
    }

}

class AddEmployeeViewer extends EditeViewer {
    constructor() {
        var props = {
            entrie: {
                id: null,
                name: "Введите имя сотрудника",
                email: "Введите адрес электронной почты",
                birthday: "Введите день рождения",
                salary: "Введите зарплату"
            },
            header: "Добавление нового сотрудника",
            submitAdress: window.location.host + "/employee/ajax/new_employee",
            submitMessage: "Добавить сотрудника"
        };
        super(props);
    }

}

class RemoveViewer extends React.Component {
    constructor(props) {
        super(props);
        this._entrieToRemove = props.entrie;
    }

    render() {
        return React.createElement("div", null, React.createElement("div", null, "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043F\u0438\u0441\u0438:"), React.createElement(EmployeeViewer, {
            entrie: _employeeTableHeader
        }), React.createElement(EmployeeViewer, {
            entrie: this._entrieToRemove
        }), React.createElement("div", null, "\u0412\u044B \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u043F\u0438\u0441\u044C?"), React.createElement("button", {
            onClick: function () {
                return;
            },
            id: "cancel"
        }, "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435"), React.createElement("button", {
            onClick: function () {
                return;
            },
            id: "remove"
        }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C"));
    }

}

class AutorisationViewer extends React.Component {
    constructor(props) {
        super(props);
        this._nextPath = props.nextPath;
    }

    render() {
        return React.createElement("div", null, React.createElement("b", null, "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0430 \u043D\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0431\u0430\u0437\u044B \u0434\u0430\u043D\u043D\u044B\u0445.", React.createElement("br", null), "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438 \u043F\u0430\u0440\u043E\u043B\u044C."), React.createElement("form", null, React.createElement("input", {
            type: "text",
            name: "username",
            value: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F"
        }), React.createElement("input", {
            type: "password",
            name: "password",
            value: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C"
        }), React.createElement("input", {
            type: "submit",
            name: "login",
            value: "\u0412\u043E\u0439\u0442\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443"
        }), React.createElement("br", null), React.createElement("a", {
            href: StartPage
        }, "\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443")));
    }

}

class BasePageViewer extends React.Component {
    constructor(props) {
        super(props);
        this._entries = props.ajaxMessage._entries;
    }

    render() {
        return React.createElement("div", {
            className: "panel-body"
        }, React.createElement("h1", null, "\u0412\u0441\u0435 \u0440\u0430\u0431\u043E\u0442\u043D\u0438\u043A\u0438.", React.createElement("br", null)), React.createElement("table", {
            className: "table table-striped table-condensed"
        }, React.createElement("thead", null, React.createElement(EmployeeViewer, {
            entrie: _employeeTableHeader
        })), React.createElement("tbody", null, this._entries.map(currentEntrie => React.createElement(EmployeeViewer, {
            entrie: currentEntrie,
            useEdite: true,
            useID: false
        })))), React.createElement(BtnLink, {
            href: "https://" + window.location.host + "/employee/new_employee",
            text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430."
        }));
    }

}

onDocumentUpdate();

function SendGetRequest(requestURL, renderDelegate) {
    var request = new XMLHttpRequest();
    request.open("GET", requestURL, true);
    request.send();

    request.onreadystatechange = function () {
        if (!isCorrectRequest(request)) return;
        var responseJSON = JSON.parse(request.responseText);
        renderDelegate(responseJSON);
    };
}

class App extends React.Component {
    render() {

    var basePath = "/employee/";
    var pathMedians = "base/|/new_employee|/delete_employee/|";
    pathMedians = pathMedians.split("|");

    for (var i = 0; i < pathMedians.length; i++) {
        var pathMedian = pathMedians[i];

        if (path.startsWith(basePath + pathMedian)) {
            var requestURL = "https://" + window.location.host;

            if (i == 0) {
                var index = path.substr(basePath.length + pathMedian.length, path.length + 1);
                requestURL += "/employee/" + "ajax/" + "base/" + index;

                function renderdelegate(responseJSON) {

                    ReactDOM.render(React.createElement(BasePageViewer, {
                        ajaxMessage: responseJSON
                    }), domContainer);
                }

                SendGetRequest(requestURL, renderdelegate);
                return;
            }

            if (token != null && tokenLifeTime > Date.now) {
                switch (i) {
                    case 1:
                        var requestURL = "https://" + window.location.host;
                        requestURL += "/employee/" + "ajax/" + "new_employee";

                        function renderdelegate(responseJSON) {
                            ReactDOM.render(React.createElement(AddEmployeeViewer, {
                                ajaxMessage: responseJSON
                            }), domContainer);
                        }

                        SetNewEmployeePage(requestURL);
                        break;

                    case 2:
                        SetDeleteEmployeePage();
                        break;

                    case 3:
                        SetEditeEmployeePage();
                        break;

                    default:
                        alert("Не реализованный метод!");
                        break;
                }
            } else {
                nextPath = path;
                path = "/Login";
                ReactDOM.render(React.createElement(AutorisationViewer, {
                    nextPath: nextPath
                }), domContainer);
            }

            var thisState = window.history.state;
            window.history.pushState(data, title, btnPath);
            return;
        }
    }

    var divPageNotFound = document.createElement("div");
    divPageNotFound.innerHTML = "<p>Ошибка <b>404</b>, страница не найдена.<br>";
    divPageNotFound.innerHTML += "<p>Рекомендуем вернуться на главную страницу";
    document.body.appendChild(divPageNotFound);
    document.body.appendChild(CreateBtnLink("base", "Главная страница", 1));

    }
}

function isCorrectRequest(request) {
    if (request.readyState != 4) return false;

    if (request.status == 401) {
        return false;
    }

    if (request.status != 200) {
        alert(request.status + ': ' + request.statusText);
        SetErrorPage(request);
        return false;
    }

    return true;
}

function CreateAjaxLink(linkName, Id, text) {
    var btnLink = document.createElement("a");
    btnLink.className = "ajax-link";
    btnLink.innerText = text;
    var btnPath = "/employee";
    if (linkName != null) btnPath += "/" + linkName;
    if (Id != null) btnPath += "/" + Id;
    btnLink.href = "https://" + window.location.host + btnPath;
    btnLink.addEventListener("click", function (event) {
        event.preventDefault();
        path = btnPath;
        window.onDocumentUpdate();
    });
    return btnLink;
}