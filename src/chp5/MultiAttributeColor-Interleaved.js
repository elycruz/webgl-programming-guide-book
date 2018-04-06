/**
 * Created by elyde on 12/16/2016.
 */
document.addEventListener('DOMContentLoaded', function () {

    'use strict';

    var WebGlUtils = window.WebGlUtils,
        attribLoc = WebGlUtils.attribLoc,
        canvasElm = document.querySelector('#canvas1'),
        gl = WebGlUtils.getWebGlContext(canvasElm),
        basicVertexShader = document.querySelector('#basic-vertex-shader').innerText,
        basicFragmentShader = document.querySelector('#basic-fragment-shader').innerText,
        shaderConfigs = [
            [gl.VERTEX_SHADER, basicVertexShader],
            [gl.FRAGMENT_SHADER, basicFragmentShader]
        ],
        program = WebGlUtils.initProgram (gl, shaderConfigs),
        numCreatedVertices;

    function initVertexBuffers (glContext) {
        // Interleaved size and position information
        var vertices = new Float32Array([
                 0.0,  0.5, 1.0, 0.0, 0.0,
                -0.5, -0.5, 0.0, 1.0, 0.0,
                 0.5, -0.5, 0.0, 0.0, 1.0
            ]),
            vertexBuffer = glContext.createBuffer(),
            a_Position = attribLoc(gl, 'a_Position'),
            a_Color = attribLoc(gl, 'a_Color');
            // a_PointSize = attribLoc(gl, 'a_PointSize');

        const FSIZE = vertices.BYTES_PER_ELEMENT;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,  false, FSIZE * 5, 0);
        gl.enableVertexAttribArray(a_Position);

        // gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT,  false, FSIZE * 5, FSIZE * 2);
        // gl.enableVertexAttribArray(a_PointSize);

        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT,  false, FSIZE * 5, FSIZE * 2);
        gl.enableVertexAttribArray(a_Color);

        return !vertexBuffer ? -1 : 3; // num sides in shape
    }

        // Create vertices for shape
        numCreatedVertices = initVertexBuffers(gl);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);

});
