import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import {uuid, objsToListsOnKey} from "./utils/utils";
import * as navContainer from './components/app/app.nav.json';
import {isEmpty, error, log} from 'fjl';

import AppNav from "./components/app/AppNav";

const

    lazyAsyncComponent = (fetchComponent = () => (Promise.resolve({})), props = {}, metaProps = {}) => {
        return class LazyAsyncComponent extends Component {
            state = {FetchedComponent: null};
            componentWillMount() {
                // const {viewsElmRef, viewsElmVisibleClassName} = metaProps,
                //     viewsElm = viewsElmRef.current,
                //     handler = e => {
                //         log('fade-out transition completed');
                //         e.currentTarget.removeEventListener('transitionend', handler);
                //         log('awaiting component load...');
                        fetchComponent().then(({ default: component }) => {
                            log('Component fetched.  Setting component to state...');
                            this.setState({ FetchedComponent: component });
                            // metaProps.viewElmRef.current.classList.add(metaProps.viewsElmVisibleClassName);
                        });
                //     };
                // log('awaiting fade-out transition');
                // viewsElm.addEventListener('transitionend', handler);
                // viewsElm.classList.remove(viewsElmVisibleClassName);
            }
            render() {
                const { FetchedComponent } = this.state;
                return FetchedComponent ? <FetchedComponent {...props} /> : null;
            }
        };
    }
;

class App extends Component {

    static defaultProps = {
        viewsElmVisbleClassName: 'visible'
    };

    static renderRoutes(navContainer, metaProps) {
        return isEmpty(navContainer.items) ?
            null : objsToListsOnKey('items', navContainer).items.map(item => {
                const uriParts = item.uri.split('/'),
                    filePathParts = item.componentFilePath.split('/'),
                    aliasName = uriParts.length ? uriParts[uriParts.length - 1] : null;
                return (
                    <Route
                        key={uuid('route-')}
                        path={item.uri}
                        component={
                            lazyAsyncComponent(
                                () => import(item.componentFilePath + '.jsx').catch(error),
                                {
                                    fileName: filePathParts[filePathParts.length - 1] + '.jsx',
                                    aliasName,
                                    canvasId: aliasName
                                },
                                metaProps
                            )
                        }
                        {...item.reactRouterRouteParams}
                    />
                );
            });
    }

    constructor (props) {
        super(props);
        this.viewsElmRef = React.createRef();
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
                            <section ref={this.viewsElmRef}
                                     className="canvas-experiment-view view-area visible">
                                {
                                    App.renderRoutes(navContainer, {
                                        viewsElmRef: this.viewsElmRef,
                                        viewsElmVisibleClassName: this.props.viewsElmVisbleClassName
                                    })
                                }
                            </section>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
