import React, {Component} from 'react';
import {uuid, error} from '../../utils/utils';
import {getWebGlContext, initProgram, toRadians} from "../../utils/WebGlUtils-2";

const

    fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
        }`,

    vertShader = `
        attribute vec4 a_Position;
        uniform mat4 u_transformMatrix;
        void main () {
            gl_Position = u_transformMatrix * a_Position;
        }`

;

export default class RotatedTriangle_Matrix extends Component {
    static defaultProps = {
        canvasId: 'hello-triangle-canvas'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertShader],
                [gl.FRAGMENT_SHADER, fragShader]
            ],
            program = initProgram(gl, shadersAssocList);

        let numCreatedVertices,
            u_CosB, u_SinB,
            angle = 90,
            radians = toRadians(angle),
            transformMatrix,
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
        transformMatrix = new Float32Array([
            cosB,  sinB, 0.0, 0.0,
            -sinB, cosB, 0.0, 0.0,
            0.0,   0.0,  1.0, 0.0,
            0.0,   0.0,  0.0, 1.0,
        ]);

        const u_transformMatrix = gl.getUniformLocation(program, 'u_transformMatrix');

        // Pass rotation values
        u_CosB = gl.getUniformLocation(program, 'u_CosB');
        u_SinB = gl.getUniformLocation(program, 'u_SinB');
        gl.uniform1f(u_CosB, cosB);
        gl.uniform1f(u_SinB, sinB);
        gl.uniformMatrix4fv(u_transformMatrix, false, transformMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('hello-triangle-element-')}>
                    <h3>RotatedTriangle_Matrix.jsx</h3>
                </header>,
                <canvas key={uuid('hello-triangle-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
