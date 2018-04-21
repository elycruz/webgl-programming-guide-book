import React, {Component} from 'react';
import {uuid} from '../../utils/utils';

export default class RotatingTriangle extends Component {
    static defaultProps = {
        aliasName: 'experiment-alias-name',
        canvasId: 'experiment-canvas',
        fileName: 'FileNameGoesHere.jsx'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid(props.aliasName + '-element-')}>
                    <h3>{props.fileName}</h3>
                </header>,
                <canvas key={uuid(props.aliasName + '-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
