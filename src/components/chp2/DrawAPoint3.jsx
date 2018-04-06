import React, {Component} from 'react';
import {uuid, error, noop} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils';

export default class DrawAPoint3 extends Component {
    static defaultProps = {
        canvasId: 'draw-a-point-3-canvas'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
        this.onCanvasMouseDown = noop;
        this.onCanvasMouseUp = noop;
        this.onCanvasMouseMove = noop;
    }

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = WebGlUtils.getWebGlContext(canvasElm),
            basicVertexShader = document.querySelector('#basic-vertex-shader').innerText,
            basicFragmentShader = document.querySelector('#basic-fragment-shader').innerText;

        if (!WebGlUtils.initShaders (gl, basicVertexShader, basicFragmentShader)) {
            console.log('error');
        }

        let a_Position = gl.getAttribLocation(gl.program, 'a_Position'),
            u_FragColor= gl.getUniformLocation(gl.program, 'u_FragColor'),
            g_colors = [],
            g_points = [],
            SW = canvasElm.width,
            SH = canvasElm.height;

        this.onCanvasMouseDown = startPaintMouseMove.bind(this);
        this.onCanvasMouseUp = stopPaintMouseMove.bind(this);
        this.onCanvasMouseMove = paintMouseMove.bind(this);

        function getFragColorArray (x, y) {
            let retVal;
            if (x >= 0 && y >= 0) {
                retVal = [1.0, 0.0, 0.0, 1.0];
            }
            else if (x < 0 && y < 0) {
                retVal = [0.0, 1.0, 0.0, 1.0];
            }
            else {
                retVal = [1.0, 1.0, 1.0, 1.0];
            }
            return retVal;
        }

        function paintMouseMove (e) {
            var ex = e.clientX,
                ey = e.clientY,
                rect = e.target.getBoundingClientRect(),
                x = ((ex - rect.left) - SW / 2) / (SW / 2),
                y = (SH / 2 - (ey - rect.top)) / (SH / 2),
                rgba,
                pos,
                len;

            g_points.push([x, y]);
            g_colors.push(getFragColorArray(x, y));

            gl.clear(gl.COLOR_BUFFER_BIT);
            len = g_points.length;

            for (let i = 0; i < len; i += 2) {
                rgba = g_colors[i];
                pos = g_points[i];
                gl.vertexAttrib3f(a_Position, pos[0], pos[1], 0.0);
                gl.uniform4f.apply(gl, [u_FragColor].concat(rgba));
                gl.drawArrays(gl.POINTS, 0, 1);
            }
        }

        function startPaintMouseMove () {
            canvasElm.addEventListener('mousemove', this.onCanvasMouseMove);
        }

        function stopPaintMouseMove () {
            canvasElm.removeEventListener('mousemove', this.onCanvasMouseMove);
        }

        canvasElm.addEventListener('mousedown', this.onCanvasMouseDown);
        canvasElm.addEventListener('mouseup', this.onCanvasMouseUp);

        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
        // gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 0.0);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    componentWillUnmount () {
        [['mousedown', this.onCanvasMouseDown],
         ['mouseup', this.onCanvasMouseUp],
         ['mousemove', this.onCanvasMouseMove] ]
        .forEach(([name, listener]) =>
            this.canvas.current.removeEventListener(name, listener)
        );
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('draw-a-point-3-element-')}>
                    <h3>DrawPoint2.jsx</h3>
                    <p>Click and drag on the canvas to paint with the mouse.</p>
                </header>,
                <canvas key={uuid('draw-a-point-3-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>,
                <script key={uuid('draw-a-point-3-element-')} type="x-shader/x-vertex" id="basic-vertex-shader"
                    dangerouslySetInnerHTML={{__html: `attribute vec4 a_Position;
                    void main () {
                        gl_Position = a_Position;
                        gl_PointSize = 20.0;
                    }`}}></script>,
                <script key={uuid('draw-a-point-3-element-')} type="x-shader/x-fragment" id="basic-fragment-shader"
                    dangerouslySetInnerHTML={{__html: `
                    precision mediump float;
                    uniform vec4 u_FragColor;
                    void main () {
                        gl_FragColor = u_FragColor;
                    }
                    `}}></script>
            ]
        );
    }

}
