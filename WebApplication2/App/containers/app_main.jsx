import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';//DefaultRoute, 
import BaseViewer from './base/baseviewer.jsx';
import { DetailsProductViewer } from "./base/product_viewer.jsx";
import EditeProductViewer from './edite_product_base/new_edite_viewer.jsx';
import { AddProductViewer } from './edite_product_base/new_add_viewer';
import RemoveProductViewer from './edite_product_base/remove_product_viewer.jsx';
import { AutorisationViewer } from './autoryse/autoryse_base.jsx';
import ErrorPage from './error_page.jsx';
import { TO_ROOT, TO_LOGIN, TO_REMOVE, TO_ADD, TO_EDITE, TO_DETAILS} from "./common/standart_link_adress.jsx";

export default class App extends React.Component {
    render() {
        return (
            //<ErrorBoundry>
            <Router >
                <div>
                    <main>
                        <Switch>
                            <Route path={TO_EDITE} component={EditeProductViewer} />
                            <Route path={TO_ADD} component={AddProductViewer} />
                            <Route path={TO_REMOVE} component={RemoveProductViewer} />
                            <Route path={TO_LOGIN} component={AutorisationViewer} />
                            <Route path={TO_DETAILS} component={DetailsProductViewer} />
                            <Route path={TO_ROOT} component={BaseViewer} />

                            <Route path="*" component={ErrorPage} />

                        </Switch>
                    </main>
                </div>
            </Router>
            //</ErrorBoundry><DefaultRoute component={AutorisationViewer} />
        );
    }
}