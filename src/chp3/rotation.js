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
        log = console.log.bind(console),
        shaderConfigs = [
            [gl.VERTEX_SHADER, basicVertexShader],
            [gl.FRAGMENT_SHADER, basicFragmentShader]
        ],
        program = WebGlUtils.initProgram (gl, shaderConfigs),
        numCreatedVertices,
        u_CosB, u_SinB,
        angle = 90.0,
        radians = WebGlUtils.toRadians(angle),
        cosB,
        sinB;

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

    // If no program bail
    if (!program) {
        log('Error while creating and linking program.');
        return;
    }

    // Create vertices for shape
    numCreatedVertices = initVertexBuffers(gl);

    if (numCreatedVertices === -1) {
        log('Error while creating vertice buffer.');
    }

    cosB = Math.cos(rad(radians));
    sinB = Math.sin(rad(radians));

    // Pass rotation values
    u_CosB = gl.getUniformLocation(program, 'u_CosB');
    u_SinB = gl.getUniformLocation(program, 'u_SinB');
    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    // Clear then draw
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);

});

