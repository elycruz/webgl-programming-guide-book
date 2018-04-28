import React, {Component} from 'react';
import {error} from '../../utils/utils';
import {getWebGlContext, initProgram, getAttribLoc as attribLoc, getUniformLoc as uniformLoc} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    vertShader = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_ViewMatrix;
        varying vec4 v_Color;
        void main () {
            gl_Position = u_ViewMatrix * a_Position;
            v_Color = a_Color;
        }`,

    fragShader = `
        precision mediump float;
        varying vec4 v_Color;
        void main () {
            gl_FragColor = v_Color;
        }`

;

export default class LookAtTriangles extends GenericCanvasExperimentView {
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
                      0.0,  0.5, -0.4,  0.4,  1.0,  0.4, // The back, green triangle
                     -0.5, -0.5, -0.4,  0.4,  1.0,  0.4,
                      0.5, -0.5, -0.4,  1.0,  0.4,  0.4,
                      0.5,  0.5, -0.2,  1.0,  0.4,  0.4, // The middle, yellow triangle
                     -0.5,  0.5, -0.2,  1.0,  1.0,  0.4,
                      0.0, -0.5, -0.2,  1.0,  1.0,  0.4,
                      0.0,  0.5,  0.0,  0.4,  0.4,  1.0, // The front, blue triangle
                     -0.5, -0.5,  0.0,  0.4,  0.4,  1.0,
                      0.5, -0.5,  0.0,  1.0,  0.4,  0.4
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

        const viewMatrix = mat4.create(),
            eye = vec3.fromValues(0.20, 0.25, 0.25),
            currFocal = vec3.fromValues(0.0, 0.0, 0.0),
            upFocal = vec3.fromValues(0.0, 1.0, 0.0),
            u_ViewMatrix = uniformLoc(gl, 'u_ViewMatrix');

        mat4.lookAt(viewMatrix, eye, currFocal, upFocal);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }
}
