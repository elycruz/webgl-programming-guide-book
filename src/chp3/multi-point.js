/**
 * Created by edlc on 11/27/16.
 */
document.addEventListener('DOMContentLoaded', function () {

    'use strict';

    var WebGlUtils = window.WebGlUtils,
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

    if (!program) {
        log('Error while creating and linking program.');
        return;
    }

    numCreatedVertices = initVertexBuffers(gl);

    if (numCreatedVertices === -1) {
        log('Error while creating vertice buffer.');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, numCreatedVertices);

    function initVertexBuffers (glContext) {
        var vertices = new Float32Array([
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

});

