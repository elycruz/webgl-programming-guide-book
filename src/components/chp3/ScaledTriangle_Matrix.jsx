import React, {Component} from 'react';
import {uuid, error} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils-2';

const
    fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,

    vertShader = `
        attribute vec4 a_Position;
        uniform mat4 u_TransformMatrix;
        void main () {
            gl_Position = u_TransformMatrix * a_Position;
        }`
;

export default class TranslatedTriangle extends Component {
    static defaultProps = {
        canvasId: 'translated-triangle-canvas'
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

        function initVertexBuffers (glContext) {
            const vertices = new Float32Array([
                    0.0,  0.5,
                    -0.5, -0.5,
                    0.5,  -0.5
                ]),
                vertexBuffer = glContext.createBuffer(),
                _a_Position_ = gl.getAttribLocation(gl.program, 'a_Position');
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(_a_Position_, 2, gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(_a_Position_);
            return !vertexBuffer ? -1 : 3; // num sides in shape
        }

        // If no program bail
        if (!program) {
            error ('Error while creating and linking program.');
            return;
        }

        // Create vertices for shape
        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error ('Error while creating vertice buffer.');
        }

        const
            Tx = 0.5, Ty = 0.5, Tz = 0.5,
            transformMatrix = new Float32Array([
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                Tx, Ty, Tz, 1.0,
            ]),

            // Get shader variable pointer
            u_TransformMatrix = gl.getUniformLocation(gl.program, 'u_TransformMatrix');

        gl.uniformMatrix4fv(u_TransformMatrix, false, transformMatrix);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('translated-triangle-element-')}>
                    <h3>TranslatedTriangle_Matrix.jsx</h3>
                </header>,
                <canvas key={uuid('translated-triangle-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
