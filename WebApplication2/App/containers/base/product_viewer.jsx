import LinkBtn from "../common/link_btn.jsx"
import { TO_DETAILS, AJAX_DETAILS, TO_BASE, TO_EDITE, TO_REMOVE,  } from "../common/standart_link_adress.jsx";
import { GetAjaxMessageForRender } from "../common/get_ajax_message_for_render.jsx"

export const ProductViewer = (props) => {
    var tdId = null;
    if (props.useID)
        tdId = <td>{props.entrie.id}</td>;
    var tdEdite = null;
    var tdRemove = null;
    if (props.useEdite) {
        tdEdite =
            <td>
            <LinkBtn to={TO_EDITE + "/" + props.entrie.id} text="edite" />
            </td>;
        tdRemove = 
            <td>
            <LinkBtn to={TO_REMOVE+"/" + props.entrie.id} text="remove" />
            </td>
        ;
    }

    return (
        <tr id={props.entrie.id}>
            {tdId}
            <td>{props.entrie._Name}</td>
            <td>{props.entrie._Price}</td>
            <td>
                <LinkBtn to={TO_DETAILS + "/" + props.entrie.id} text="details"/>
            </td>
            {tdEdite}
            {tdRemove}
        </tr>
    )
}

export class DetailsProductViewer extends React.Component {
    constructor(props) {
        super(props);
        this.useID = props.useID;
        this._renderDetails = this._renderDetails.bind(this);
    }

    _renderDetails(_ajaxMessage) {
        return <div className="panel-body">
            <RenderProductDetails entrie={_ajaxMessage} useID={this.useID} className="DetailsProductViewer" />
        </div>
    }

    render() {

        var requestPath = window.location.pathname.replace(TO_DETAILS, AJAX_DETAILS);
        var requestURL = "https://" + window.location.host + requestPath;
        return <GetAjaxMessageForRender requestUrl={requestURL} renderMethod={this._renderDetails}/>;

    }
}
export class RenderProductDetails extends React.Component {
    constructor(props) {
        super(props);
        this.entrie = props.entrie;
        this.useEdite = props.useEdite;
        this.className = props.className ? props.className :"ProductViewer"
        if (this.useEdite == undefined)
            this.useEdite = true;

    }
    render() {
        var _entrie = this.entrie;
        var tdId = null;
        if (this.useID)
            tdId = <td>ID</td>;
        var tdEdite = null;
        var tdRemove = null;
        var rfBase = null;
        if (this.useEdite) {
            tdEdite =
                <td>
                    <LinkBtn to={TO_EDITE + "/" + _entrie.id} text="edite" />
                </td>;
            tdRemove = (
                <td>
                    <LinkBtn to={TO_REMOVE + "/" + _entrie.id} text="remove" />
                </td>);
            rfBase = <LinkBtn key="cancel" to={TO_BASE} text="Вернуться на главную страницу." />

        }

        return (
            <div>
                <table className={this.className} >
                    <tr>
                        {tdId ? <th>ID</th> : null}
                        <th>Name</th>
                        <th>Product description</th>
                        <th>Price</th>
                    </tr>
                    <tr id={_entrie.id}>
                        {tdId}
                        <td>{_entrie.name}</td>
                        <td>{_entrie.description}</td>
                        <td>{_entrie.price}</td>
                        {tdEdite}
                        {tdRemove}
                    </tr>
                </table>
                <div className="centerBlock">{rfBase}</div>
            </div>
        );
    }
}