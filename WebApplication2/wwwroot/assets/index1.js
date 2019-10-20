"use strict";

const domContainer = document.querySelector('#jsxreactdiv');

                    ReactDOM.render(React.createElement(BasePageViewer, {
                        ajaxMessage: responseJSON
                    }), domContainer);
               