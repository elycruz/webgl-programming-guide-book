/**
 * Created by elyde on 11/29/2016.
 */
/**
 * Created by edlc on 11/27/16.
 */
document.addEventListener('DOMContentLoaded', function () {

    'use strict';

    var WebGlUtils = window.WebGlUtils,
        uniformLoc = WebGlUtils.uniformLoc,
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
        angleStep = 45.0,
        currentAngle = 0.0,
        u_ModelMatrix,
        modelMatrix = new Matrix4();

    function initVertexBuffers (glContext) {
        var vertices = new Float32Array([
                0.0, 0.5, -0.5, -0.5, 0.5, -0.5
            ]),
            vertexBuffer = glContext.createBuffer(),
            _a_Position_ = gl.getAttribLocation(program, 'a_Position');
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(_a_Position_, 2, gl.FLOAT,  false, 0, 0);
        gl.enableVertexAttribArray(_a_Position_);
        return !vertexBuffer ? -1 : 3; // num sides in shape
    }

    function tick () {
        currentAngle = animate(currentAngle);
        draw(gl, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    }

    function draw (gl, currentAngle, modelMatrix, u_ModelMatrix) {
        // Create vertices for shape
        numCreatedVertices = initVertexBuffers(gl);

        modelMatrix.setRotate(currentAngle, 0, 0, 1);
        modelMatrix.translate(0.35, 0, 0);

        u_ModelMatrix = uniformLoc(gl, 'u_ModelMatrix');
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
    }

    var g_last = Date.now();
    function animate(angle) {
        var now = Date.now(),
            elapsed = now - g_last,
            newAngle;
        g_last = now;
        newAngle = (angle + (angleStep * elapsed) / 1000.0);
        return newAngle %= 360;
    }

    tick();
});
