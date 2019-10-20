import { Redirect } from "react-router-dom";
import { ErrorPage } from "../error_page.jsx";
import AutoryseBase from '../autoryse/autoryse_base.jsx';
import { sendHttpRequest } from '../autoryse/autoryse_base.jsx';


export const GetAjaxMessageForRender = (props) => {


    var querry = window.location.search;
    var request = new XMLHttpRequest();
    if (querry != null && querry != undefined)
        request.open("GET", props.requestUrl + querry, false);
    else
        request.open(requestType, requestURL, false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();
    
    var code = request.status;
    if (request.status == 200) {
        try {
            return props.renderMethod(JSON.parse(request.responseText));
        }
        catch (Error) {
            code = 400;
            return <ErrorPage code={code} text={Error.message+"\n\n"} />;
        }
    }
    else
        return <ErrorPage code={code} text={request.responseText} />;
}

export function GetAjaxMessage(requestUrl){
    var request = new XMLHttpRequest();
    request.open("GET", props.requestUrl, false);
    request.setRequestHeader('Authorization', 'Bearer ' + access_token);
    request.send();
    if (request.status != 200)
        return { errorCode: request.status, errorMessage: request.responseText };
    return JSON.parse(request.responseText);
}