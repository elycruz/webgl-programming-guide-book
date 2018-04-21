/**
 * Created by elyde on 12/16/2016.
 */
(function () {

    'use strict';

    var WebGlUtils = window.WebGlUtils,
        uniformLoc = WebGlUtils.uniformLoc,
        attribLoc = WebGlUtils.attribLoc;

    function initVertexBuffers (gl) {
        // Interleaved size and position information
        var vertexTexCoords = new Float32Array([
                -0.5,  0.5, 0.0, 1.0,
                -0.5, -0.5, 0.0, 0.0,
                0.5,  0.5, 1.0, 1.0,
                0.5, -0.5, 1.0, 0.0
            ]),
            vertexBuffer = gl.createBuffer(),
            a_Position = attribLoc(gl, 'a_Position'),
            a_TexCoord = attribLoc(gl, 'a_TexCoord');
        // a_PointSize = attribLoc(gl, 'a_PointSize');


        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexTexCoords, gl.STATIC_DRAW);

        const FSIZE = vertexTexCoords.BYTES_PER_ELEMENT;

        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,  false, FSIZE * 4, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT,  false, FSIZE * 4, FSIZE * 2);
        gl.enableVertexAttribArray(a_TexCoord);

        return !vertexBuffer ? -1 : 4; // num sides in shape
    }

    function initTextures (gl, numVertices, numLoadedTextures) {
        [[gl.createTexture(),
         uniformLoc(gl, 'u_Sampler0'),
         new Image(), '../assets/sky.jpg'
        ],
        [gl.createTexture(),
         uniformLoc(gl, 'u_Sampler1'),
         new Image(), '../assets/circle.gif'
        ]]
        .forEach(function (tuple4, index) {
            tuple4[2].addEventListener('load', function () {
                loadTexture(gl, numVertices, tuple4[0], tuple4[1], tuple4[2], index, ++numLoadedTextures);
            });
            tuple4[2].src = tuple[3];
        });
        return true;
    }

    function loadTexture(gl, numVertices, texture, u_Sampler, image, textureIndex, numLoadedTextures) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,  1);
        gl.activeTexture(gl['TEXTURE' + textureIndex]);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, textureIndex);

        // Clear then draw
        if (numLoadedTextures >= 1) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices);
        }
    }

    function init () {
        var canvasElm = document.querySelector('#canvas1'),
            glContext = WebGlUtils.getWebGlContext(canvasElm),
            vertexShader = document.querySelector('#basic-vertex-shader').innerText,
            fragmentShader = document.querySelector('#basic-fragment-shader').innerText,
            shaderConfigs = [
                [glContext.VERTEX_SHADER, vertexShader],
                [glContext.FRAGMENT_SHADER, fragmentShader]
            ],
            program = WebGlUtils.initProgram (glContext, shaderConfigs),
            numInitVerts = initVertexBuffers(glContext),
            initSuccessBln = initTextures(glContext, numInitVerts, 0);
    }

    document.addEventListener('DOMContentLoaded', init);

}());
