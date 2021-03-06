import React, {Component} from 'react';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram, toAttribLoc as attribLoc, toUniformLoc as uniformLoc,
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

export default class DepthBuffer extends GenericCanvasExperimentView {
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
            const verticeAndSizes = new Float32Array([
                    // X, Y, Z, R, G, B
                    // Triangles in the center

                     0.0,  1.0, 0.0, 0.4, 0.4, 1.0,  // Blue triangle in front
                    -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
                     0.5, -1.0, 0.0, 1.0, 0.4, 0.4,

                     0.0,  1.0, -2.0, 1.0, 1.0, 0.4,  // Yellow triangle in middle
                    -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
                     0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

                     0.0,  1.0, -4.0, 0.4, 1.0, 0.4,  // Green triangle in back
                    -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
                     0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
                ]),
                FSIZE = verticeAndSizes.BYTES_PER_ELEMENT,
                vertexBuffer = glContext.createBuffer(),
                a_Position = attribLoc(gl, 'a_Position'),
                a_Color = attribLoc(gl, 'a_Color')
            ;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticeAndSizes, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT,  false, FSIZE * 6, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT,  false, FSIZE * 6, FSIZE * 3);
            gl.enableVertexAttribArray(a_Color);

            return !vertexBuffer ? -1 : 9; // num sides in shape
        }

        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertices buffer.');
        }
                                //  x   y   z
        const eye = vec3.fromValues(0,  0,  5),  // Get converted to floating point
            currFocal = vec3.fromValues(0,  0, -100),
            upFocal =   vec3.fromValues(0,  1,  0),
            u_MvpMatrix = uniformLoc(gl, 'u_MvpMatrix'),
            viewMatrix = mat4.create(),
            projMatrix = mat4.create(),
            modelMatrix = mat4.create(),
            mvpMatrix = mat4.create();

        mat4.lookAt(viewMatrix, eye, currFocal, upFocal);
        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.0, 0.0));
        mat4.perspective(projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);

        mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-1.50, 0.0, 0.0));
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    render () {
        const {props} = this;

        return (
            <div>
                <header>
                    <h3>{props.fileName}</h3>
                </header>
                <p>Properly rendering along axises despite order shapes/vertices are defined in.</p>
                <canvas width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            </div>
        );
    }

}
