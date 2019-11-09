import React, {Component} from 'react';
import {uuid} from "../../utils/utils";

export default class DrawRectangle extends Component {
    static defaultProps = {
        canvasId: 'draw-rect-canvas'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount () {
        const ctx = this.canvas.current.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 255, 1.0';
        ctx.fillRect(120, 10, 150, 150);
    }

    render () {
        const {props} = this;
        return ([
            <header key={uuid('draw-a-point-element-')}>
                <h3>DrawRectangle.jsx</h3>
                <p>Basic example of drawing into '2d' context.</p>
            </header>,
            <canvas key={uuid('draw-a-point-element-')} width="377" height="377"
                    id={props.canvasId} ref={this.canvas}>
                <p>Html canvas element not supported</p>
            </canvas>
        ]);
    }

}
