import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import {uuid} from "./utils/utils";
import * as navContainer from './app.nav';

import AppNav from "./AppNav";
import DrawRectangle from "./components/chp2/DrawRectangle";
import DrawAPoint from "./components/chp2/DrawAPoint";
import DrawAPoint2 from "./components/chp2/DrawAPoint2";
import DrawAPoint3 from "./components/chp2/DrawAPoint3";
import MultiPoint from "./components/chp3/MultiPoint";
import HelloTriangle from "./components/chp3/HelloTriangle";
import HelloQuad from "./components/chp3/HelloQuad";
import TranslatedTriangle from "./components/chp3/TranslatedTriangle";
import RotatedTriangle from "./components/chp3/RotatedTriangle";
import RotatedTriangle_Matrix from "./components/chp3/RotatedTriangle_Matrix";

class App extends Component {
    static renderRoutes () {
        return ([
            <Route key={uuid('route-')} path={"/"} render={() => (<p>Examples from the book "Webgl Programming Guide - ..."</p>)} exact={true} />,
            <Route key={uuid('route-')} path={"/chp2/draw-rectangle"} component={DrawRectangle} />,
            <Route key={uuid('route-')} path={"/chp2/draw-a-point"} component={DrawAPoint} />,
            <Route key={uuid('route-')} path={"/chp2/draw-a-point-2"} component={DrawAPoint2} />,
            <Route key={uuid('route-')} path={"/chp2/draw-a-point-3"} component={DrawAPoint3} />,
            <Route key={uuid('route-')} path={"/chp3/multi-point"} component={MultiPoint} />,
            <Route key={uuid('route-')} path={"/chp3/hello-triangle"} component={HelloTriangle} />,
            <Route key={uuid('route-')} path={"/chp3/hello-quad"} component={HelloQuad} />,
            <Route key={uuid('route-')} path={"/chp3/translated-triangle"} component={TranslatedTriangle} />,
            <Route key={uuid('route-')} path={"/chp3/rotated-triangle"} component={RotatedTriangle} />,
            <Route key={uuid('route-')} path={"/chp3/rotated-triangle-matrix"} component={RotatedTriangle_Matrix} />,
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
                            <section>{App.renderRoutes(navContainer)}</section>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
