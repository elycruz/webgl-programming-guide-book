import React, {Component} from 'react';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram, getAttribLoc as attribLoc, getUniformLoc as uniformLoc,
    loadTexture
} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";
import texImage from '../../assets/sky.jpg';

const

    fragShader = `
        precision mediump float;
        uniform sampler2D u_Sampler;
        varying vec2 v_TexCoord;
        void main () {
            gl_FragColor = texture2D(u_Sampler, v_TexCoord);
        }`,

    vertShader = `
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        void main () {
            gl_Position = a_Position;
            v_TexCoord = a_TexCoord;
        }`,

    imageFilePath = texImage // Normalize texture-image's filepath based on
                             // react-scripts development server

;

export default class TextureQuad_Repeat extends GenericCanvasExperimentView {
    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertShader],
                [gl.FRAGMENT_SHADER, fragShader]
            ],
            program = initProgram(gl, shadersAssocList);

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        function initVertexBuffers (gl) {
            const vertexCoords = new Float32Array([
                    -0.5,  0.5, -0.3, 1.7,
                    -0.5, -0.5, -0.3, -0.2,
                    0.5,  0.5, 1.7, 1.7,
                    0.5, -0.5, 1.7, -0.2
                ]),
                vertexBuffer = gl.createBuffer(),
                a_Position = attribLoc(gl, 'a_Position'),
                a_TexCoord = attribLoc(gl, 'a_TexCoord')
            ;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexCoords, gl.STATIC_DRAW);

            const FSIZE = vertexCoords.BYTES_PER_ELEMENT;

            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,  false, FSIZE * 4, 0);
            gl.enableVertexAttribArray(a_Position);

            gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT,  false, FSIZE * 4, FSIZE * 2);
            gl.enableVertexAttribArray(a_TexCoord);

            return !vertexBuffer ? -1 : 4; // num sides in shape
        }

        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertices buffer.');
        }

        function initTextures (gl, numVertices) {
            let texture = gl.createTexture();
            let u_Sampler = uniformLoc(gl, 'u_Sampler');
            let image = new Image();
            image.onload = function () {
                loadTexture(gl, numVertices, texture, u_Sampler, image);
            };
            image.src = imageFilePath;
            return true;
        }

        function loadTexture(gl, numVertices, texture, u_Sampler, image) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,  1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            // gl.generateMipmap(gl.TEXTURE_2D); // alternative to texParameteri above
            gl.uniform1i(u_Sampler, 0);

            // Clear then draw
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, numVertices);
        }

        initTextures(gl, numCreatedVertices);
    }
}
