import { Link } from "react-router-dom";

export const ErrorPage = (props) => {
    return (
        <div color="red">
            <h1>Ошибка:{props.code}</h1>
            <b>{props.text}</b><br />
            Рекоммендуем вернуться на <Link to="/1">главную страницу</Link>.
            </div>
    );
}


export const ExceptionPage = (props) => {
    var exceptionObj = JSON.parse(props.jsonException);
    return (
        <div>
            <h1>{exceptionObj.ClassName}</h1>
            <h2>{exceptionObj.Message}</h2>
            <h3>{exceptionObj.StackTraceString}</h3>
            <Link to={props.previosPage}>Return to previos page.</Link>
            <Link to="/1">Return to base page.</Link>
        </div>
    );
}