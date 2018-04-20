import React, {Component} from 'react';
import {uuid, error} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils-2';

const fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,
    vertShader = `
        attribute vec4 a_Position;
        void main () {
            gl_Position = a_Position;
            gl_PointSize = 10.0;
        }`
;

export default class MultiPoint extends Component {
    static defaultProps = {
        canvasId: 'multi-point-canvas'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = WebGlUtils.getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertShader],
                [gl.FRAGMENT_SHADER, fragShader]
            ],
            program = WebGlUtils.initProgram(gl, shadersAssocList);

        let numCreatedVertices;

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertice buffer.');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, numCreatedVertices);

        function initVertexBuffers (glContext) {
            const vertices = new Float32Array([
                    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
                ]),
                vertexBuffer = glContext.createBuffer(),
                _a_Position_ = gl.getAttribLocation(gl.program, 'a_Position');
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(_a_Position_, 2, gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(_a_Position_);
            return !vertexBuffer ? -1 : 3; // num sides in shape
        }
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('multi-point-element-')}>
                    <h3>MultiPoint.jsx</h3>
                    <p>Multi points example.</p>
                </header>,
                <canvas key={uuid('multi-point-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
