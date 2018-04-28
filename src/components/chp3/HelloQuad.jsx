import React, {Component} from 'react';
import {error} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils-2';
import GenericCanvasExperimentView from '../app/GenericCanvasExperimentView';

const

    fragmentShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,

    vertextShader = `
        attribute vec4 a_Position;
        void main () {
            gl_Position = a_Position;
        }`

;

export default class HelloQuad extends GenericCanvasExperimentView {

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = WebGlUtils.getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertextShader],
                [gl.FRAGMENT_SHADER, fragmentShader]
            ],
            program = WebGlUtils.initProgram(gl, shadersAssocList);

        let numCreatedVertices;

        function initVertexBuffers (glContext) {
            const vertices = new Float32Array([
                    -0.5,  0.5,
                    -0.5, -0.5,
                    0.5,  0.5,
                    0.5, -0.5
                ]),
                vertexBuffer = glContext.createBuffer(),
                _a_Position_ = gl.getAttribLocation(gl.program, 'a_Position');
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(_a_Position_, 2, gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(_a_Position_);
            return !vertexBuffer ? -1 : 4; // num sides in shape
        }

        if (!program) {
            error ('Error while creating and linking program.');
            return;
        }

        numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error ('Error while creating vertice buffer.');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, numCreatedVertices);
    }

}
