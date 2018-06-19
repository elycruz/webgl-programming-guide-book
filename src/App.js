import React, {Component} from 'react';
import {debounce, findNavItemByUri} from "./utils/utils";
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
        viewsElmVisbleClassName: 'visible',
        mobileNavActiveClassName: 'mobile-nav-active'
    };

    static onLinkClick (e) {
        this.currentLocationInfo = e.detail;
        this.viewsElmRef.current.classList.remove(this.props.viewsElmVisbleClassName);
        if (this.htmlElm.classList.contains('mobile-size')) {
            this.boundHamburgerClick(e);
        }
    }

    static onHamburgerClick () {
        this.htmlElm.classList.toggle(this.props.mobileNavActiveClassName);
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
        this.navRef = React.createRef();
        // this.hamburgerRef = React.createRef();
        this.navContainer = navContainer;
        this.currentLocationInfo = findNavItemByUri(window.location.pathname, this.navContainer.items);
        this.boundOnLinkClick = App.onLinkClick.bind(this);
        this.boundOnViewsAreaTransitionEnd = App.onViewsAreaTransitionEnd.bind(this);
        this.boundHamburgerClick = App.onHamburgerClick.bind(this);
        this.state.CurrentView = this.getViewFor(!this.currentLocationInfo ? errorViewInfo : this.currentLocationInfo);
        this.htmlElm = document.querySelector('html');
    }

    componentWillMount () {
        // Listen for window size change so we can branch our logic for different
        // screen sizes (from within business logic)
        const onWindowResize = () => {
                if (window.innerWidth <= 767) {
                    this.htmlElm.classList.add('mobile-size');
                }
                else {
                    this.htmlElm.classList.remove('mobile-size');
                }
            },
            onWindowResizeDebounced = debounce(onWindowResize, 100);
        window.addEventListener('load', onWindowResize);
        window.addEventListener('resize', onWindowResizeDebounced);
        window.addEventListener('orientationchange', onWindowResizeDebounced);
    }

    componentDidMount () {
        window.addEventListener('popstate', e => {
            e.detail = e.state || findNavItemByUri(window.location.pathname, this.navContainer.items);
            this.boundOnLinkClick(e);
        });
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
                        <div className="flex-container">
                            <a className="hamburger-btn"
                                onClick={this.boundHamburgerClick}>
                                <div className="slice">&nbsp;</div>
                                <div className="slice">&nbsp;</div>
                                <div className="slice">&nbsp;</div>
                            </a>
                            <h1><a href="/">WebGl Programming Guide Book Examples</a></h1>
                        </div>
                    </div>
                </header>
                <main>
                    <div>
                        <AppNav navContainer={this.navContainer}
                                onLinkClick={this.boundOnLinkClick}
                                innerRef={this.navRef}
                        />
                        <section ref={this.viewsElmRef}
                                 className="view-area visible"
                                 onTransitionEnd={this.boundOnViewsAreaTransitionEnd}>
                            <CurrentView />
                        </section>
                    </div>
                </main>
                <div className="overlay-bg"
                     onClick={this.boundHamburgerClick}>&nbsp;</div>
            </div>
        );
    }
}

export default App;
