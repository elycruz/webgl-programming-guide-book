/**
 * Created by elyde on 12/15/2016.
 */
/**
 * Created by elyde on 11/29/2016.
 */
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
        // pageTurnFragmentShader = document.querySelector('#page-turn-fragment-shader').innerText,
        log = console.log.bind(console),
        shaderConfigs = [
            [gl.VERTEX_SHADER, basicVertexShader],
            [gl.FRAGMENT_SHADER, basicFragmentShader],
            // [gl.FRAGMENT_SHADER, pageTurnFragmentShader]
        ],
        program = WebGlUtils.initProgram (gl, shaderConfigs),
        numCreatedVertices,
        u_Translation,

        // Translation vars
        tx = 0.5, ty = 0.5, tz = 0.0;

    function initVertexBuffers (glContext) {
        var vertices = new Matrix4({
                elements: new Float32Array([
                    -0.5,  0.5,
                    -0.5, -0.5,
                    0.5,  0.5,
                    0.5, -0.5
                ])
            }),
                vertexBuffer = glContext.createBuffer(),
            _a_Position_ = gl.getAttribLocation(gl.program, 'a_Position');
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(_a_Position_, 2, gl.FLOAT,  false, 0, 0);
        gl.enableVertexAttribArray(_a_Position_);
        return !vertexBuffer ? -1 : 4; // num sides in shape
    }

    // If no program bail
    if (!program) {
        log('Error while creating and linking program.');
        return;
    }

    // Create vertices for shape
    numCreatedVertices = initVertexBuffers(gl);

    // Pass translation values
    u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation, tx, ty, tz, 0.0);

    if (numCreatedVertices === -1) {
        log('Error while creating vertice buffer.');
    }

    // Clear then draw
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, numCreatedVertices);

});


