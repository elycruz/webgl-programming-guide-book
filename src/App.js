import React, {Component} from 'react';
import {objsToListsOnKey} from "./utils/utils";
import * as navContainer from './components/app/app.nav.json';

import AppNav from "./components/app/AppNav";

const

    defaultFetchComponent = () => (Promise.resolve({})),

    lazyAsyncComponent = (fetchComponent = defaultFetchComponent, props = {}) => {
        return class LazyAsyncComponent extends Component {
            state = {FetchedComponent: null};
            componentWillMount() {
                fetchComponent().then(({default: component}) => {
                    this.setState({FetchedComponent: component});
                });
            }
            render() {
                const { FetchedComponent } = this.state;
                return FetchedComponent ? <FetchedComponent {...props} /> : null;
            }
        };
    },

    returnErrorView = () => Promise.resolve((<h2>Page not found</h2>))
;

class App extends Component {

    static defaultProps = {
        viewsElmVisbleClassName: 'visible'
    };

    static onLinkClick (e) {
        this.currentLocationInfo = e.detail;
        this.viewsElmRef.current.classList.remove(this.props.viewsElmVisbleClassName);
    }

    static onViewsAreaTransitionEnd (e) {
        if (!e.currentTarget.classList.contains(this.props.viewsElmVisbleClassName)) {
            this.setState({CurrentView: this.getViewFor(this.currentLocationInfo)});
            e.currentTarget.classList.add(this.props.viewsElmVisbleClassName);
        }
    }

    state = {CurrentView: null};

    constructor (props) {
        super(props);
        const errorViewInfo = {
            componentFilePath: './components/app/404',
            uri: '/app/404-error'
        };
        this.viewsElmRef = React.createRef();
        this.navContainerItemsList = objsToListsOnKey('items', navContainer).items;
        this.currentLocationInfo = this.navContainerItemsList
            .filter(x => x.uri === window.location.pathname).shift(); // assume flat list for now
        this.boundOnLinkClick = App.onLinkClick.bind(this);
        this.boundonViewsAreaTransitionEnd = App.onViewsAreaTransitionEnd.bind(this);
        this.state.CurrentView = this.getViewFor(!this.currentLocationInfo ? errorViewInfo : this.currentLocationInfo);
    }

    getViewFor (linkInfo) {
        const uriParts = linkInfo.uri.split('/'),
            filePathParts = linkInfo.componentFilePath.split('/'),
            aliasName = uriParts.length ? uriParts[uriParts.length - 1] : null;
        return lazyAsyncComponent(
            () => import(linkInfo.componentFilePath + '.jsx').catch(returnErrorView),
            {
                fileName: filePathParts[filePathParts.length - 1] + '.jsx',
                aliasName,
                canvasId: aliasName
            }
        );
    }

    render() {
        const {CurrentView} = this.state;
        return (
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
                        <AppNav navContainer={navContainer}
                                navContainerItemsList={this.navContainerItemsList}
                                onLinkClick={this.boundOnLinkClick} />
                        <section ref={this.viewsElmRef}
                                 className="canvas-experiment-view view-area visible"
                                 onTransitionEnd={this.boundonViewsAreaTransitionEnd}>
                            <CurrentView />
                        </section>
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
