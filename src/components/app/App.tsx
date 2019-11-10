import React, {Component, PureComponent, FunctionComponent, ReactEventHandler, Suspense} from 'react';
import {debounce, findNavItemByUri} from "../../utils/utils";
import navContainer from './config.app.nav';
import viewsMap from "./config.views.map";

import AppNav from "./AppNav";
import {LocationInfo} from "./LocationInfo";

interface ApplicationState {
  currentViewProps: object,
  CurrentView: Component | PureComponent | FunctionComponent
}

interface ApplicationProps {
  viewsElmVisbleClassName: string,
  mobileNavActiveClassName: string,
}

class App extends Component<ApplicationProps> {
  static defaultProps = {
    viewsElmVisbleClassName: 'visible',
    mobileNavActiveClassName: 'mobile-nav-active'
  } as ApplicationProps;

  htmlElm: HTMLElement = document.querySelector('html');

  boundHamburgerClick: ReactEventHandler;
  boundOnViewsAreaTransitionEnd: ReactEventHandler;
  boundOnLinkClick: ReactEventHandler;

  prevLocInfo: LocationInfo;
  currLocInfo: LocationInfo;
  navContainer: LocationInfo;

  viewsElmRef: React.RefObject<HTMLElement> = null;
  navRef: React.RefObject<HTMLElement> = null;

  state: ApplicationState = {
    currentViewProps: {},
    CurrentView: null
  };

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
    this.prevLocInfo =
      this.currLocInfo =
        findNavItemByUri(window.location.pathname, this.navContainer.items);
    this.boundOnLinkClick = this.onLinkClick.bind(this);
    this.boundOnViewsAreaTransitionEnd = this.onViewsAreaTransitionEnd.bind(this);
    this.boundHamburgerClick = this.onHamburgerClick.bind(this);
    const [currentViewProps, CurrentView] =
      this.getViewFor(!this.currLocInfo ? errorViewInfo : this.currLocInfo);

    this.state.CurrentView = CurrentView;
    this.state.currentViewProps = currentViewProps;
  }

  UNSAFE_componentWillMount() {
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

  onLinkClick(e) {
    if (this.htmlElm.classList.contains('mobile-size')) {
      this.boundHamburgerClick(e);
    }
    if (this.prevLocInfo &&
      e.detail && e.detail.uri &&
      this.prevLocInfo.uri === e.detail.uri) {
      return;
    }
    this.prevLocInfo =
      this.currLocInfo = e.detail;
    this.viewsElmRef.current.classList.remove(this.props.viewsElmVisbleClassName);
  }

  onHamburgerClick() {
    this.htmlElm.classList.toggle(this.props.mobileNavActiveClassName);
  }

  onViewsAreaTransitionEnd(e) {
    if (!e.currentTarget.classList.contains(this.props.viewsElmVisbleClassName)) {
      const [currentViewProps, CurrentView] = this.getViewFor(this.currLocInfo);
      this.setState({CurrentView, currentViewProps});
      e.currentTarget.classList.add(this.props.viewsElmVisbleClassName);
    }
  }

  getViewFor(linkInfo) {
    const uriParts = linkInfo.uri.split('/'),
      filePathParts = linkInfo.componentFilePath.split('/'),
      aliasName = uriParts.length ? uriParts[uriParts.length - 1] : null,
      viewProps = {
        fileName: filePathParts[filePathParts.length - 1],
        aliasName,
        canvasId: aliasName
      };
    return [viewProps, viewsMap[linkInfo.componentFilePath]];
  }

  render() {
    const {CurrentView, currentViewProps} = this.state;
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
              <Suspense fallback={<div>Loading...</div>}>
                <CurrentView {...currentViewProps}/>
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

export default App;
