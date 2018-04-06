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

    if (!WebGlUtils.initShaders (gl, basicVertexShader, basicFragmentShader)) {
        console.log('error');
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'),
        u_FragColor= gl.getUniformLocation(gl.program, 'u_FragColor'),
        g_colors = [],
        g_points = [],
        SW = canvasElm.width,
        SH = canvasElm.height;

    function getFragColorArray (x, y) {
        var retVal;
        if (x >= 0 && y >= 0) {
            retVal = [1.0, 0.0, 0.0, 1.0];
        }
        else if (x < 0 && y < 0) {
            retVal = [0.0, 1.0, 0.0, 1.0];
        }
        else {
            retVal = [1.0, 1.0, 1.0, 1.0];
        }
        return retVal;
    }

    function paintMouseMove (e) {
        var ex = e.clientX,
            ey = e.clientY,
            rect = e.target.getBoundingClientRect(),
            x = ((ex - rect.left) - SW / 2) / (SW / 2),
            y = (SH / 2 - (ey - rect.top)) / (SH / 2),
            rgba,
            pos,
            len;

        g_points.push([x, y]);
        g_colors.push(getFragColorArray(x, y));

        gl.clear(gl.COLOR_BUFFER_BIT);
        len = g_points.length;

        for (var i = 0; i < len; i += 2) {
            rgba = g_colors[i];
            pos = g_points[i];
            gl.vertexAttrib3f(a_Position, pos[0], pos[1], 0.0);
            gl.uniform4f.apply(gl, [u_FragColor].concat(rgba));
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }

    function startPaintMouseMove () {
        canvasElm.addEventListener('mousemove', paintMouseMove);
    }

    function stopPaintMouseMove () {
        canvasElm.removeEventListener('mousemove', paintMouseMove);
    }

    canvasElm.addEventListener('mousedown', startPaintMouseMove);
    canvasElm.addEventListener('mouseup', stopPaintMouseMove);

    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    // gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

});
