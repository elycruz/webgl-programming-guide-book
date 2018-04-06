/**
 * Created by elyde on 12/16/2016.
 */
document.addEventListener('DOMContentLoaded', function () {

    'use strict';

    var WebGlUtils = window.WebGlUtils,
        uniformLoc = WebGlUtils.uniformLoc,
        attribLoc = WebGlUtils.attribLoc,
        canvasElm = document.querySelector('#canvas1'),
        gl = WebGlUtils.getWebGlContext(canvasElm),
        basicVertexShader = document.querySelector('#basic-vertex-shader').innerText,
        basicFragmentShader = document.querySelector('#basic-fragment-shader').innerText,
        log = console.log.bind(console),
        shaderConfigs = [
            [gl.VERTEX_SHADER, basicVertexShader],
            [gl.FRAGMENT_SHADER, basicFragmentShader]
        ],
        program = WebGlUtils.initProgram (gl, shaderConfigs),
        numCreatedVertices;

    function initVertexBuffers (glContext) {
        var vertices = new Float32Array([
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

        // Create vertices for shape
        numCreatedVertices = initVertexBuffers(gl);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, numCreatedVertices);

});
