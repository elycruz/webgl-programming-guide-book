import React, {Component, PureComponent, FunctionComponent, ReactEventHandler, Suspense} from 'react';
import {debounce, findNavItemByUri} from "../../utils/utils";
import navContainer from './config.app.nav';
import viewsMap from "./config.views.map";

import AppNav from "./AppNav";

const returnErrorView = () => Promise.resolve((<h2>Page not found</h2>));

interface ApplicationState {
  currentViewProps: object,
  CurrentView: Component | PureComponent | FunctionComponent
}

class Application extends Component {

  htmlElm: HTMLElement;
  boundHamburgerClick: ReactEventHandler;

  state: ApplicationState = {
    currentViewProps: {},
    CurrentView: null
  };

  static defaultProps = {
    viewsElmVisbleClassName: 'visible',
    mobileNavActiveClassName: 'mobile-nav-active'
  };

  static onLinkClick(e) {
    if (this.htmlElm.classList.contains('mobile-size')) {
      this.boundHamburgerClick(e);
    }
    if (this.previousLocInfo &&
      e.detail && e.detail.uri &&
      this.previousLocInfo.uri === e.detail.uri) {
      return;
    }
    this.previousLocInfo =
      this.currentLocationInfo =
        e.detail;
    this.viewsElmRef.current.classList.remove(this.props.viewsElmVisbleClassName);
  }

  static onHamburgerClick() {
    this.htmlElm.classList.toggle(this.props.mobileNavActiveClassName);
  }

  static onViewsAreaTransitionEnd(e) {
    if (!e.currentTarget.classList.contains(this.props.viewsElmVisbleClassName)) {
      const [currentViewProps, CurrentView] = this.getViewFor(this.currentLocationInfo);
      this.setState({CurrentView, currentViewProps});
      e.currentTarget.classList.add(this.props.viewsElmVisbleClassName);
    }
  }

  constructor(props) {
    super(props);
    const errorViewInfo = {
      componentFilePath: './components/app/404',
      uri: '/app/404-error'
    };
    this.viewsElmRef = React.createRef();
    this.navRef = React.createRef();
    // this.hamburgerRef = React.createRef();
    this.navContainer = navContainer;
    this.previousLocInfo =
      this.currentLocationInfo =
        findNavItemByUri(window.location.pathname, this.navContainer.items);
    this.boundOnLinkClick = Application.onLinkClick.bind(this);
    this.boundOnViewsAreaTransitionEnd = Application.onViewsAreaTransitionEnd.bind(this);
    this.boundHamburgerClick = Application.onHamburgerClick.bind(this);
    const [currentViewProps, CurrentView] =
      this.getViewFor(!this.currentLocationInfo ? errorViewInfo : this.currentLocationInfo);

    this.state.CurrentView = CurrentView;
    this.state.currentViewProps = currentViewProps;
    this.htmlElm = document.querySelector('html');
  }

  componentWillMount() {
    // Listen for window size change so we can branch our logic for different
    // screen sizes (from within business logic)
    const onWindowResize = () => {
        if (window.innerWidth <= 767) {
          this.htmlElm.classList.add('mobile-size');
        } else {
          this.htmlElm.classList.remove('mobile-size');
        }
      },
      onWindowResizeDebounced = debounce(onWindowResize, 100);
    window.addEventListener('load', onWindowResize);
    window.addEventListener('resize', onWindowResizeDebounced);
    window.addEventListener('orientationchange', onWindowResizeDebounced);
  }

  componentDidMount() {
    window.addEventListener('popstate', e => {
      e.detail = e.state || findNavItemByUri(window.location.pathname, this.navContainer.items);
      this.boundOnLinkClick(e);
    });
  }

  getViewFor(linkInfo) {
    const uriParts = linkInfo.uri.split('/'),
      filePathParts = linkInfo.componentFilePath.split('/'),
      aliasName = uriParts.length ? uriParts[uriParts.length - 1] : null,
      viewProps = {
        fileName: filePathParts[filePathParts.length - 1] + '.jsx',
        aliasName,
        canvasId: aliasName
      };
    return [viewProps, viewsMap[linkInfo.componentFilePath]];
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
              <Suspense fallback={'<div>Loading...</div>'}>
                <CurrentView/>
              </Suspense>
            </section>
          </div>
        </main>
        <div className="overlay-bg"
             onClick={this.boundHamburgerClick}>&nbsp;</div>
      </div>
    );
  }
}

export default Application;
