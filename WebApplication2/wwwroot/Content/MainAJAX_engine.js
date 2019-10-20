"use strict";
dfgh
var token = null;
var tokenLifeTime = Date.now() - 1;
var strURL = window.pathname;
const basePath = "/employee/base/1";

document.head.title = 123456789;
document.body.style.backgroundColor = 'white';
var nextPath = null;
var path = window.location.pathname;

function onDocumentUpdate() {
    var basePath = "/employee/";

    ClearBody();

    var pathMedians = "base/|/new_employee|/delete_employee/|";
    pathMedians = pathMedians.split("|");

    for (var i = 0; i < pathMedians.length; i++) {
        var pathMedian = pathMedians[i];
        if (path.startsWith(basePath + pathMedian)) {
            if (i == 0) {
                SetBasePage(path, basePath, pathMedian);
                return;
            }
            if (token != null && tokenLifeTime > Date.now) {
                switch (i) {
                    case 1: SetNewEmployeePage();
                        return;
                    case 2: SetDeleteEmployeePage();
                        return;
                    case 3: SetEditeEmployeePage();
                        return;
                    default: alert("Не реализованный метод!")
                        break;
                }
            }
            else {
                SetAutorisationPage();
                return;
            }
        }
    }
    var divPageNotFound = document.createElement("div");
    divPageNotFound.innerHTML = "<p>Ошибка <b>404</b>, страница не найдена.<br>"
    divPageNotFound.innerHTML += "<p>Рекомендуем вернуться на главную страницу";
    document.body.appendChild(divPageNotFound);
    document.body.appendChild(CreateBtnLink("base", "Главная страница", 1));

}

function ClearBody() {
    while (document.body.childElementCount != 0) {
        document.body.removeChild(document.body.firstChild);
    }
}

function SetBasePage(path, basePath, pathMedian) {

    var indexSTR = path.substr(basePath.length + pathMedian.length, path.length + 1);
    var index = Number.parseInt(indexSTR);
    var requestURL = "https://" + window.location.host + path.substr(0, path.length - (basePath + pathMedian).length - 1);
    requestURL += basePath + "ajax/" + "base/" + indexSTR;

    var request = new XMLHttpRequest();
    request.open("GET", requestURL, true);
    request.send();
    request.onreadystatechange = function () {
        if (!isCorrectRequest(request))
            return;

        ClearBody();
        var ajaxMessage = JSON.parse(request.responseText);
        var divHead = document.createElement("div");
        divHead.className = "panel - heading";
        divHead.innerText = "Все работники";
        document.body.appendChild(divHead);
        var _entries = ajaxMessage._entries;

        BuildTable(_entries);

        BuildNavigationList(ajaxMessage);

        var divAddEmployeeLink = document.createElement("div");
        divAddEmployeeLink.className = "Add-New-Employee-Link";
        divAddEmployeeLink.appendChild(CreateBtnLink("new_employee", "Добавить сотрудника", null));

    };

    function BuildNavigationList(ajaxMessage) {
        var divNav = document.createElement("div");
        divNav.className = "nav";
        document.body.appendChild(divNav);

        var listNav = document.createElement("li");
        divNav.appendChild(listNav);
        var pageNum = ajaxMessage._currentPageNum;

        var n = 1;
        AddNumToNavList(n, pageNum, listNav);
        n = pageNum - 2;
        while (n < pageNum + 2 && n <= ajaxMessage._pageCount) {
            if (n > 1) {
                AddNumToNavList(n, pageNum, listNav);
            }
            n++;
        }
        if (n < ajaxMessage._pageCount) {
            AddNumToNavList(n, pageNum, listNav);
        }

    }

    function AddNumToNavList(n, pageNum, listNav) {
        if (n != pageNum) {
            var link = document.createElement("a");
            link.class = "btn-base";
            link.id = n;
            link.innerText = n + ", ";
            listNav.appendChild(link);
        }
        else {
            var text = document.createElement("div");
            text.innerText = n + ", ";
            listNav.appendChild(text);
        }
    }
}

function SetEditEmployeePage(employeeID) {
    var requestURL = "https://" + window.location.host + "employee/ajax/edite_employee/" + employeeID;

    var request = CreateAutorisedRequest(requestURL, null);
    request.onreadystatechange = function () {
        if (!isCorrectRequest(request))
            return;
        CreateEmployeeForm(employeeID, request, requestURL);
    };
}

function SetNewEmployeePage() {
    var requestURL = "https://" + window.location.host + "employee/ajax/new_employee";
    CreateEmployeeForm(null, null, requestURL);
}

function SetDeleteEmployeePage(employeeID) {
    var divHeader = document.createElement("div");
    var isNew = (employeeID == null);
    divHeader.innerText = "<b>Вы действительно хотите удалить данные этого сотрудника?</b>";
    document.body.appendChild(divHeader);

    var tableBody = document.createElement("tbody");
    divTable.appendChild(tableBody);
    var tableRov = document.createElement("tr");
    var rovData = "<td>" + _entries[i].id + "</td>";
    rovData += "<td>" + _entries[i].name + "</td>";
    rovData += "<td>" + _entries[i].email + "</td>";
    rovData += "<td>" + _entries[i].birthday + "</td>";
    rovData += "<td>" + _entries[i].salary + "</td>";
    tableRov.innerHTML = rovData;
    tableBody.appendChild(tableRov);

    var vtnRov = document.createElement("tr");
    var btnCancel = CreateBtnLink("base", "Отменить удаление", 1);
    vtnRov.appendChild(btnCancel);

    var hrefRemove = "https://" + window.location.host + "/employee/ajax/delete_employee/" + employeeID;
    var btnRemoveEntry = document.createElement("button");
    btnRemoveEntry.innerText = "Удалить запись";
    btnRemoveEntry.addEventListener("click", function () {
        var request = CreateAutorisedRequest(requestURL, null);
        request.onreadystatechange = function () {
            if (!isCorrectRequest(request))
                return;
            path = "/employee/base/1";
            onDocumentUpdate();
        };
    });
}

function SetAutorisationPage(request) {
    ClearBody();
    var divHeader = document.createElement("div");
    divHeader.innerHTML = "<b>Подтвердите права на изменение базы данных.</b><br> "
    divHeader.innerHTML += "Введите имя пользователя и пароль.</b>";
    document.body.appendChild(divHeader);
    var loginForm = document.createElement("form");
    CreateInputElement("text", "userName", "Введите имя пользователя", loginForm);
    CreateInputElement("password", "password", "Введите пароль", loginForm);
    CreateInputElement("submit", "login", "Войти в систему", loginForm);
    loginForm.onsubmit = function (event) {
        event.preventDefault;
        var login = loginForm.children.item(0).value;
        if (!isValide("userName", login) || !isValidePassword("password", password))
            return false;

        var password = loginForm.children.item(1).value;
        var getTokenRequest = new XMLHttpRequest();
        getTokenRequest.open('POST', "https://" + window.location.host + "/login", true);
        getTokenRequest.send("{ userName: " + login + ", password: " + password + " }");

    }
    document.body.appendChild(loginForm);
    document.body.appendChild(CreateBtnLink("base", "Вернуться на главную страницу", "1"));
}

function CreateEmployeeForm(employeeID, request, requestURL) {
    var divHeader = document.createElement("div");
    var isNew = (employeeID == null);
    divHeader.innerText = (isNew ? "<b>Введите" : "<b>Обновите") + " данные сотрудника.</b>";
    document.body.appendChild(divHeader);
    var employeeForm = document.createElement("form");
    employeeForm.name = 'employeeForm';
    employeeForm.method = 'POST';
    employeeForm.action = requestURL;
    var entry = isNew ? null : JSON.parse(request.responseText);
    CreateInputElement('hidden', "id", (isNew ? null : entry.id), employeeForm);
    CreateInputElement('text', 'name', (isNew ? "Введите имя сотрудника" : entry.name), employeeForm);
    CreateInputElement('email', 'email', (isNew ? "Введите адрес электронной почты сотрудника" : entry.email), employeeForm);
    CreateInputElement('date', 'birthday', (isNew ? "Введите дату рождения сотрудника" : entry.birthday), employeeForm);
    CreateInputElement('number', 'salary', (isNew ? "Введите заработную плату сотрудника" : entry.salary), employeeForm);
    var btnCancel = document.createElement("button");
    btnCancel.innerText = "Отменить изменение";
    btnCancel.href = "/employee/base/1";
    employeeForm.appendChild(btnCancel);
    var btnSubmit = document.createElement("button");
    btnSubmit.innerText = isNew ? "Внести новую запись" : "Изменить запись";
    btnSubmit.type = "submit";
    employeeForm.appendChild(btnSubmit);
    employeeForm.onsubmit = function (event) {
        event.preventDefault();
        var jsonRequestBody = "{ id: " + document.getElementsByName("id").innerText;
        jsonRequestBody += ", name: " + document.getElementsByName("name").innerText;
        jsonRequestBody += ", email: " + document.getElementsByName("email").innerText;
        jsonRequestBody += ", birthday: " + document.getElementsByName("birthday").innerText;
        jsonRequestBody += ", salary: " + document.getElementsByName("salary").innerText + " }";
        var submitRequest = CreateAutorisedRequest(requestURL, jsonRequestBody);
        submitRequest.onreadystatechange = function () {
            if (!isCorrectRequest(request)) {
                if (request.status == 401) {
                    SetAutorisationPage(this);
                }
                else {
                    SetErrorPage(this);
                }
                return;
            }
            path = basePath;
            onDocumentUpdate();
        };
    };
}

function BuildTable(_entries) {
    var divTable = document.createElement("div");
    divTable.className = "panel-body";
    var employeeTable = document.createElement("table");
    employeeTable.className = "table table-striped table-condensed";
    divTable.appendChild(employeeTable);
    document.body.appendChild(divTable);
    var tableHead = document.createElement("thead");
    tableHead.innerHTML = "<tr><th>ID</th><th>Имя</th><th>Адрес электронной почты</th><th>День рождения</th><th>Зарплата</th><th></th></tr>";
    divTable.appendChild(tableHead);
    var tableBody = document.createElement("tbody");
    divTable.appendChild(tableBody);
    for (var i = 0; i < _entries.length; i++) {
        var tableRov = document.createElement("tr");
        var rovData = "<td>" + _entries[i].id + "</td>";
        rovData += "<td>" + _entries[i].name + "</td>";
        rovData += "<td>" + _entries[i].email + "</td>";
        rovData += "<td>" + _entries[i].birthday + "</td>";
        rovData += "<td>" + _entries[i].salary + "</td>";
        tableRov.innerHTML = rovData;

        var tableD_edit = document.createElement("td");
        tableD_edit.appendChild(CreateBtnLink("edit", "edit", _entries[i].id));

        tableRov.appendChild(tableD_edit);

        var tableD_remove = document.createElement("td");
        tableD_remove.appendChild(CreateBtnLink("remove", "remove", _entries[i].id));
        tableRov.appendChild(tableD_remove);

        tableBody.appendChild(tableRov);
    }
}

function CreateInputElement(tb_type, tb_name, tb_value, employeeForm) {
    var node_tb = document.createElement('input');
    node_tb.type = tb_type;
    node_tb.name = tb_name;
    node_tb.value = tb_value;
    employeeForm.appendChild(node_tb);
}

function CreateBtnLink(linkBtnName, linkBtnText, linkBtnId) {
    var btnLink = document.createElement("a");
    btnLink.className = "btn-link-ajax";
    btnLink.innerText = linkBtnText;
    var btnPath = "/employee";
    if (linkBtnName != null)
        btnPath += "/" + linkBtnName;

    if (linkBtnId != null)
        btnPath += "/" + linkBtnId;

    btnLink.href = "https://" + window.location.host + btnPath;

    btnLink.addEventListener("click", function (event) {
        event.preventDefault();
        path = btnPath;
        window.onDocumentUpdate();
    });

    return btnLink;
}

function CreateAutorisedRequest(requestURL, body) {
    var request = new XMLHttpRequest();
    request.open('POST', requestURL, true);
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.setRequestHeader('Content-Type', 'application/json');

    request.send(body);
    return request;
}

function isCorrectRequest(request) {
    if (request.readyState != 4)
        return false;
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

function isValide(type, value) {
    if (!value)
        return generateError("Поле не может быть пустым!");

    if (type == "password") {
        if (value.length < 4)
            return generateError("");
        
    }
    var generateError = function (text) {
        var error = document.createElement('div')
        error.className = 'error'
        error.style.color = 'red'
        error.innerHTML = text
        return error
    }
}

onDocumentUpdate();