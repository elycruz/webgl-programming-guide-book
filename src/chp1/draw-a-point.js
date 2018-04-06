/**
 * Created by edlc on 11/27/16.
 */
document.addEventListener('DOMContentLoaded', function () {

    'use strict';

    var WebGlUtils = window.WebGlUtils,
        canvasElm = document.querySelector('#canvas1'),
        gl = WebGlUtils.getWebGlContext(canvasElm),
        basicVertexShader = document.querySelector('#basic-vertex-shader').innerText,
        basicFragmentShader = document.querySelector('#basic-fragment-shader').innerText;

    // gl.fillStyle = 'rgba(0,0,255,1.0)';
    // gl.fillRect(120, 10, 150, 150);

    if (!WebGlUtils.initShaders (gl, basicVertexShader, basicFragmentShader)) {
        console.error('error');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

    // ctx.drawColor(1.0,0.0,0.0,1.0);
    // ctx.drawPoint(0,0,0,10);

});

