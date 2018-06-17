import React from 'react';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram, getAttribLoc as attribLoc, getUniformLoc as uniformLoc,
    toRadians
} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    vertShader = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_MvpMatrix;
        varying vec4 v_Color;
        void main () {
            gl_Position = u_MvpMatrix * a_Position;
            v_Color = a_Color;
        }`,

    fragShader = `
        precision mediump float;
        varying vec4 v_Color;
        void main () {
            gl_FragColor = v_Color;
        }`

;

export default class HelloCube extends GenericCanvasExperimentView {
    static defaultProps = {
        aliasName: 'experiment-alias-name',
        canvasId: 'experiment-canvas',
        fileName: 'FileNameGoesHere.jsx'
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

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        function initVertexBuffers (glContext) {
            const
                verticesAndColors = new Float32Array([
                    // Vertice and colors
                    1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
                    -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
                    -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
                    1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
                    1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
                    1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
                    -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
                    -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
                ]),
                // Face indice triangles
                indices = new Uint8Array([
                    0, 1, 2,  0, 2, 3, // front
                    0, 3, 4,  0, 4, 5, // right
                    0, 5, 6,  0, 6, 1, // top
                    1, 6, 7,  1, 7, 2, // left
                    7, 4, 3,  7, 3, 2, // bottom
                    4, 7, 6,  4, 6, 5  // back
                ]),
                FSIZE = verticesAndColors.BYTES_PER_ELEMENT,
                vertexAndColorBuffer = glContext.createBuffer(),
                indexBuffer = glContext.createBuffer(),
                a_Position = attribLoc(gl, 'a_Position'),
                a_Color = attribLoc(gl, 'a_Color')
            ;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexAndColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticesAndColors, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT,  false, FSIZE * 6, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT,  false, FSIZE * 6, FSIZE * 3);
            gl.enableVertexAttribArray(a_Color);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            return !vertexAndColorBuffer || !indexBuffer ? -1 :
                indices.length; // num sides in shape
        }

        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertices buffer.');
        }
                                //  x   y   z
        const eye =       vec3.fromValues(3,  3,  7),  // Get converted to floating point
            currFocal =   vec3.fromValues(0,  0,  0),
            upFocal =     vec3.fromValues(0,  1,  0),
            u_MvpMatrix = uniformLoc(gl, 'u_MvpMatrix'),
            viewMatrix =  mat4.create(),
            projMatrix =  mat4.create(),
            modelMatrix = mat4.create(),
            mvpMatrix =   mat4.create();

        mat4.lookAt(viewMatrix, eye, currFocal, upFocal);
        // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.0, 0.0));
        mat4.perspective(projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, numCreatedVertices, gl.UNSIGNED_BYTE, 0);
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
