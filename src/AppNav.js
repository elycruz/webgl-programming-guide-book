import React, {Component} from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import {isEmpty, keys} from 'fjl';
import {objsToListsOnKey, uuid} from './utils/utils';

export default class AppNav extends Component {
    static defaultProps = {
        navContainer: {}
    };

    static initialState = () => ({});

    constructor (props) {
        super(props);
        this.state = AppNav.initialState();
    }

    static renderUnorderedList (items) {
        if (isEmpty(items)) {
            return null;
        }
        return (<ul key={uuid('ul-')}>
            {items.map(item => (<li key={uuid('ul-li-')}>
                    <Link to={item.uri} className={item.uri === window.location.pathname ? 'active' : ''}>
                        {item.label}
                    </Link>
                    {item.items ? AppNav.renderUnorderedList(item.items) : null}
                </li>)
            )}
        </ul>);
    }

    render () {
        const {props, state} = this;
        return (<nav>
            {AppNav.renderUnorderedList(objsToListsOnKey('items', props.navContainer).items)}
        </nav>)
    }
}


