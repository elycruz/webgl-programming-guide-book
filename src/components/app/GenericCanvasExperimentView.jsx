import React, {Component} from 'react';
import {uuid} from '../../utils/utils';

export default class GenericCanvasExperimentView extends Component {
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

        return (
            <div>
                <header>
                    <h3>{props.fileName}</h3>
                </header>
                <canvas width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            </div>
        );
    }

}
