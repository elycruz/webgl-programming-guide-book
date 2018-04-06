import React, {Component} from 'react';
import {uuid} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils';

export default class DrawAPoint extends Component {
    static defaultProps = {
        canvasId: 'draw-a-point-canvas'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = WebGlUtils.getWebGlContext(canvasElm),
            basicVertexShader = document.querySelector('#basic-vertex-shader').innerText,
            basicFragmentShader = document.querySelector('#basic-fragment-shader').innerText;

        // gl.fillStyle = 'rgba(0,0,255,1.0)';
        // gl.fillRect(120, 10, 150, 150);

        if (!WebGlUtils.initShaders (gl, basicVertexShader, basicFragmentShader)) {
            console.error('error');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);

        // ctx.drawColor(1.0,0.0,0.0,1.0);
        // ctx.drawPoint(0,0,0,10);
    }

    render () {
        const {props} = this;

        return ([
                <div key={uuid('draw-a-point-element-')}>
                    <p>In this exercise in chapter 2 of weblg-prog-guide, the author shows the user how draw in a '2d' canvas.</p>
                </div>,
                <canvas key={uuid('draw-a-point-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>,
                <script key={uuid('draw-a-point-element-')} type="x-shader/x-vertex" id="basic-vertex-shader"
                    dangerouslySetInnerHTML={{__html: `void main () {
                        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
                        gl_PointSize = 10.0;
                    }`}}></script>,
                <script key={uuid('draw-a-point-element-')} type="x-shader/x-fragment" id="basic-fragment-shader"
                    dangerouslySetInnerHTML={{__html: `
                    void main () {
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    }
                    `}}></script>
            ]
        );
    }

}
