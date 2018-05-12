import React, {Component} from 'react';
import {error} from '../../utils/utils';
import {getWebGlContext, initProgram, toRadians} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";
import rafLimiter from '../../utils/raqLimiter';

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

export default class RotatingTriangle extends GenericCanvasExperimentView {

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertShader],
                [gl.FRAGMENT_SHADER, fragShader]
            ],
            program = initProgram(gl, shadersAssocList),
            angleStep = 45.0;

        let currentAngle = 0.0
        ;

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        const u_TransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrix'),
            modelMatrix = mat4.create();

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

        function draw (delta) {
            currentAngle = (angleStep * delta * 0.001) % 360;

            // Create vertices for shape
            const numCreatedVertices = initVertexBuffers(gl);

            if (numCreatedVertices === -1) {
                error('Error while creating vertice buffer.');
                // return;
            }

            mat4.rotateZ(modelMatrix, modelMatrix, toRadians(currentAngle));

            // Pass rotation values
            gl.uniformMatrix4fv(u_TransformMatrix, false, modelMatrix);

            // Clear then draw
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
        }

        rafLimiter(draw, 144);
    }


}
