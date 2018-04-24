import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import {isEmpty, keys, log} from 'fjl';
import {objsToListsOnKey, uuid} from '../../utils/utils';

export default class AppNav extends Component {
    static defaultProps = {
        navContainer: {},
        onLinkClick: () => (undefined)
    };

    renderUnorderedList (items) {
        if (isEmpty(items)) {
            return null;
        }
        return (<ul key={uuid('ul-')}>
            {items.map(item => (<li key={uuid('ul-li-')}>
                    <Link to={item.uri} className={item.uri === window.location.pathname ? 'active' : ''} onClick={this.props.onLinkClick}>
                        {item.label}
                    </Link>
                    {item.items ? this.renderUnorderedList(item.items) : null}
                </li>)
            )}
        </ul>);
    }

    render () {
        const {props} = this;
        return (<nav>
            {this.renderUnorderedList(objsToListsOnKey('items', props.navContainer).items)}
        </nav>)
    }
}


