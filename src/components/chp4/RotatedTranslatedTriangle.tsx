import React, {Component} from 'react';
import {uuid, error, log} from '../../utils/utils';
import {getWebGlContext, initProgram, toRadians} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';

const ListF32 = from => new Float32Array(from);

const

    fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
        }`,

    vertShader = `
        attribute vec4 a_Position;
        uniform mat4 u_TransformMatrix;
        void main () {
            gl_Position = u_TransformMatrix * a_Position;
        }`

;

export default class RotatedTranslatedTriangle extends Component {
    static defaultProps = {
        canvasId: 'rotated-triangle-canvas'
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
            angle = 90,
            radians = toRadians(angle),
            modelMatrix,
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
        modelMatrix = mat4.create(); // transformMatrix

        mat4.scale(modelMatrix, modelMatrix, ListF32([0.5, 0.5, 1]));
        mat4.rotateZ(modelMatrix, modelMatrix, radians);
        mat4.translate(modelMatrix, modelMatrix, ListF32([sinB, cosB, 1]));

        const u_TransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrix');

        // Pass rotation values
        gl.uniformMatrix4fv(u_TransformMatrix, false, modelMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid('rotated-triangle-element-')}>
                    <h3>AnimatedTriangle.jsx</h3>
                </header>,
                <canvas key={uuid('rotated-triangle-element-')} width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            ]
        );
    }

}
