import React, {Component} from 'react';
import {uuid, error, log} from '../../utils/utils';
import {getWebGlContext, initProgram, toRadians, toAttribLoc as attribLoc, toUniformLoc as uniformLoc} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    fragShader = `
        precision mediump float;
        varying vec4 v_Color;
        void main () {
            gl_FragColor = v_Color;
        }`,

    vertShader = `
        attribute vec4 a_Position;
        attribute float a_PointSize;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        void main () {
            gl_Position = a_Position;
            gl_PointSize = a_PointSize;
            v_Color = a_Color;
        }`

;

export default class MultiAttributeColor extends GenericCanvasExperimentView {
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
                    // Coord, Coord, Size, Color, Color, Color
                     0.0,   0.5,  10.0,  1.0,  0.0,  0.0,  // Vertex 1
                    -0.5,  -0.5,  20.0,  0.0,  1.0,  0.0,  // Vertex 2
                     0.5,  -0.5,  30.0,  0.0,  0.0,  1.0   // Vertex 3
                ]),
                FSIZE = verticeAndSizes.BYTES_PER_ELEMENT,
                vertexBuffer = glContext.createBuffer(),
                a_Position = attribLoc(gl, 'a_Position'),
                a_PointSize = attribLoc(gl, 'a_PointSize'),
                a_Color = attribLoc(gl, 'a_Color')
            ;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, verticeAndSizes, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,  false, FSIZE * 6, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT,  false, FSIZE * 6, FSIZE * 2);
            gl.enableVertexAttribArray(a_PointSize);

            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT,  false, FSIZE * 6, FSIZE * 3);
            gl.enableVertexAttribArray(a_Color);

            return !vertexBuffer ? -1 : 3; // num sides in shape
        }

        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertices buffer.');
        }

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, numCreatedVertices);
    }
}
