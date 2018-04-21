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
        uniform vec4 u_Translation;
        void main () {
            gl_Position = a_Position + u_Translation;
        }`
;

export default class TranslatedTriangle extends Component {
    static defaultProps = {
        canvasId: 'translated-triangle-matrix-canvas'
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
            u_Translation,
            // Translation vars
            tx = 0.5, ty = 0.5, tz = 0.0;

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
        numCreatedVertices = initVertexBuffers(gl);

        // Pass translation values
        u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
        gl.uniform4f(u_Translation, tx, ty, tz, 0.0);

        if (numCreatedVertices === -1) {
            error ('Error while creating vertice buffer.');
        }

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('translated-triangle-matrix-element-')}>
                    <h3>TranslatedTriangle.jsx</h3>
                </header>,
                <canvas key={uuid('translated-triangle-matrix-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
