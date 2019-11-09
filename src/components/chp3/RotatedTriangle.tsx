import React, {Component} from 'react';
import {uuid, error} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils-2';

const

    fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,

    vertShader = `
        // x' = x cos b - y sin b
        // y' = x sin b + y cos
        // z' = z
        attribute vec4 a_Position;
        uniform float u_CosB, u_SinB;
        void main () {
            gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
            gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
            gl_Position.z = a_Position.z;
            gl_Position.w = 1.0;
        }`

;

export default class RotatedTriangle extends Component {
    static defaultProps = {
        canvasId: 'hello-triangle-canvas'
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

        let numCreatedVertices,
            u_CosB, u_SinB,
            angle = 90,
            radians = WebGlUtils.toRadians(angle),
            cosB,
            sinB;

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

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertice buffer.');
        }

        cosB = Math.cos(radians);
        sinB = Math.sin(radians);

        // Pass rotation values
        u_CosB = gl.getUniformLocation(program, 'u_CosB');
        u_SinB = gl.getUniformLocation(program, 'u_SinB');
        gl.uniform1f(u_CosB, cosB);
        gl.uniform1f(u_SinB, sinB);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('hello-triangle-element-')}>
                    <h3>RotatedTriangle.jsx</h3>
                </header>,
                <canvas key={uuid('hello-triangle-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
