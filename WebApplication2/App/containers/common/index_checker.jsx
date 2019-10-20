
import { ErrorPage } from "../error_page.jsx";

export const IndexChecker = (props) => {

    var path = window.location.pathname;
    var indexSTR = path.substring(props.basisPathLength, path.length + 1);
    if (indexSTR == "")
        return props.emptyIndexRender;

    //var index = Number.parseInt(indexSTR);
    if (Number.isNaN(indexSTR))
        return <ErrorPage code="404" text={"invalid index: " + indexSTR} />
    return props.viewer;
}