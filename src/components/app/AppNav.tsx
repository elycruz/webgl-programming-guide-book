import React, {Component} from 'react';
import {isEmpty} from 'fjl';
import {uuid} from '../../utils/utils';

export default class AppNav extends Component {
    static defaultProps = {
        navContainer: [],
        onLinkClick: () => undefined,
        innerRef: null
    };

    static onLinkClick (e) {
        e.preventDefault();
        const elm = e.currentTarget,
            {componentFilePath, uri, label} = elm.dataset;
        e.detail = {label, componentFilePath, uri};
        window.history.pushState(e.detail, label, uri);
        this.props.onLinkClick(e);
        window.scroll(0, 0);
    }

    constructor (props) {
        super(props);
        this.boundOnLinkClick = AppNav.onLinkClick.bind(this);
    }

    renderUnorderedList (items) {
        if (isEmpty(items)) {
            return null;
        }
        return (<ul key={uuid('ul-')}>
            {items.map((item, ind) => (<li key={uuid('ul-li-')}>
                    <a href={item.uri}
                       className={item.active ? 'active' : ''}
                       onClick={this.boundOnLinkClick}
                       data-component-file-path={item.componentFilePath}
                       data-label={item.label}
                       data-uri={item.uri}
                    >
                        {item.label}
                    </a>
                    {item.items ? this.renderUnorderedList(item.items) : null}
                </li>)
            )}
        </ul>);
    }

    render () {
        const {props} = this;
        return (<nav ref={props.innerRef}>
            {this.renderUnorderedList(props.navContainer.items)}
        </nav>)
    }
}


