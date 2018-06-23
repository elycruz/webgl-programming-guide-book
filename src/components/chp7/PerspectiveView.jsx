import React, {Component} from 'react';
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
        uniform mat4 u_ProjMatrix;
        uniform mat4 u_ViewMatrix;
        varying vec4 v_Color;
        void main () {
            gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
            v_Color = a_Color;
        }`,

    fragShader = `
        precision mediump float;
        varying vec4 v_Color;
        void main () {
            gl_FragColor = v_Color;
        }`

;

export default class PerspectiveView extends GenericCanvasExperimentView {
    static defaultProps = {
        aliasName: 'experiment-alias-name',
        canvasId: 'experiment-canvas',
        fileName: 'FileNameGoesHere.jsx'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
        this.nearValueRef = React.createRef();
        this.farValueRef = React.createRef();
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
                    // Triangles on right
                    0.75,  1.0, -4.0, 0.4, 1.0, 0.4,  // Green triangle in back
                    0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
                    1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

                    0.75,  1.0, -2.0, 1.0, 1.0, 0.4,  // Yellow triangle in middle
                    0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
                    1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

                    0.75,  1.0, 0.0, 0.4, 0.4, 1.0,  // Blue triangle in front
                    0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
                    1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

                    // X, Y, Z, R, G, B
                    // Triangles on left side
                    -0.75,  1.0, -4.0, 0.4, 1.0, 0.4,  // Green triangle in back
                    -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
                    -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

                    -0.75,  1.0, -2.0, 1.0, 1.0, 0.4,  // Yellow triangle in middle
                    -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
                    -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

                    -0.75,  1.0, 0.0, 0.4, 0.4, 1.0,  // Blue triangle in front
                    -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
                    -0.25, -1.0, 0.0, 1.0, 0.4, 0.4
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

            return !vertexBuffer ? -1 : 18; // num sides in shape
        }

        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertices buffer.');
        }

        let g_near = 1.0,
            g_far = 100.0;

        const viewMatrix = mat4.create(),
                                    //  x   y   z
            eye =       vec3.fromValues(0,  0,  5),  // Get converted to floating point
            currFocal = vec3.fromValues(0,  0, -100),
            upFocal =   vec3.fromValues(0, 1,  0),
            u_ProjMatrix = uniformLoc(gl, 'u_ProjMatrix'),
            u_ViewMatrix = uniformLoc(gl, 'u_ViewMatrix'),
            projMatrix = mat4.create(),
            onKeyDown = e => {
                switch (e.key) {
                    case 'ArrowRight':
                        g_near += 0.01;
                        break;
                    case 'ArrowLeft':
                        g_near -= 0.01;
                        break;
                    case 'ArrowUp':
                        g_far += 0.01;
                        break;
                    case 'ArrowDown':
                        g_far -= 0.01;
                        break;
                    default: return;
                }
                draw();
            },
            draw = () => {
                mat4.perspective(projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);
                gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);
                gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix);

                this.farValueRef.current.innerHTML = Math.round(g_far * 100) / 100;
                this.nearValueRef.current.innerHTML = Math.round(g_near * 100) / 100;

                // Clear then draw
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
            };

        this.onKeyDown = onKeyDown;
        mat4.lookAt(viewMatrix, eye, currFocal, upFocal);
        document.addEventListener('keydown', onKeyDown);
        draw();
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.onKeyDown);
    }

    render () {
        const {props} = this;

        return (
            <div>
                <header>
                    <h3>{props.fileName}</h3>
                </header>
                <p>Change orthographic 'far' and 'near' faces with arrow keys</p>
                <canvas width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
                <div className="controls">
                    <div>
                        <label htmlFor="nearValue">near:</label>
                        <output ref={this.nearValueRef} id="nearValue" />
                    </div>
                    <div>
                        <label htmlFor="farValue">far:</label>
                        <output ref={this.farValueRef} id="farValue" />
                    </div>
                </div>
            </div>
        );
    }

}
