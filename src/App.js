import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import {uuid} from "./utils/utils";
import * as navContainer from './app.nav';
import AppNav from "./AppNav";
import DrawRectangle from "./components/chp1/DrawRectangle";
import DrawAPoint from "./components/chp1/DrawAPoint";

class App extends Component {
    renderRoutes (navContainer) {
        return ([
            <Route key={uuid('route-')} path={"/"} render={() => (<p>Hello</p>)} exact={true}/>,
            <Route key={uuid('route-')} path={"/chp2/draw-a-point"} component={DrawAPoint} />,
            <Route key={uuid('route-')} path={"/chp2/draw-rectangle"} component={DrawRectangle} />
        ]);
    }

    render() {
        return (
            <BrowserRouter>
                <div id="wrapper" className="clearfix">
                    <header>
                        <div>
                            <div className="logo">
                                <div>
                                    <a className="hamburger-btn">
                                        <div className="slice">&nbsp;</div>
                                        <div className="slice">&nbsp;</div>
                                        <div className="slice">&nbsp;</div>
                                    </a>
                                    <h1><a href="#">WebGl Programming Guide Book Examples</a></h1>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div>
                            <AppNav navContainer={navContainer} />
                            <section>
                            {this.renderRoutes(navContainer)}
                            </section>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
