import React, {Component} from 'react';
import {uuid, error, log} from '../../utils/utils';
import {getWebGlContext, initProgram, toRadians, toAttribLoc as attribLoc, toUniformLoc as uniformLoc} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,

    vertShader = `
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main () {
            gl_Position = a_Position;
            gl_PointSize = a_PointSize;
        }`

;

export default class MultiAttributeSize extends GenericCanvasExperimentView {
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
            let vertices = new Float32Array([
                    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
                ]),
                sizes = new Float32Array([
                    10.0, 20.0, 30.0
                ]),
                vertexBuffer = glContext.createBuffer(),
                sizeBuffer = glContext.createBuffer(),
                a_Position = attribLoc(gl, 'a_Position'),
                a_PointSize = attribLoc(gl, 'a_PointSize');

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(a_PointSize);

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
