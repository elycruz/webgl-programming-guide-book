/**
 * Created by edlc on 11/27/16.
 */

import {log, error} from './console';

export const

    WEBGL_NAMES = Object.freeze(["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]),

    webGlCreationErrorEventName = 'webglcontextcreationerror',

    initShaders = (gl, vshader, fshader) => {
        const program = createProgram(gl, vshader, fshader);
        if (!program) {
            error('Failed to create program');
            return false;
        }
        gl.useProgram(program);
        gl.program = program;
        return true;
    },

    createProgram = (gl, vshader, fshader) => {
        // Create shader object
        let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
        let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return undefined;
        }

        // Create a program object
        let program = gl.createProgram();
        if (!program) {
            return undefined;
        }

        // Attach the shader objects
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // Link the program object
        gl.linkProgram(program);

        // Check the result of linking
        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let err = gl.getProgramInfoLog(program);
            log('Failed to link program: ' + err);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return undefined;
        }
        return program;
    },

    loadShader = (gl, type, source) => {
        // Create shader object
        let shader = gl.createShader(type);
        if (!shader) {
            error('unable to create shader');
            return undefined;
        }

        // Set the shader program
        gl.shaderSource(shader, source);

        // Compile the shader
        gl.compileShader(shader);

        // Check the result of compilation
        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(shader);
            error('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return undefined;
        }

        return shader;
    },

    getWebGlContext = (canvas, options, onError) => {
        _addCreationListener(canvas, onError);
        let context = undefined,
            namesLen = WEBGL_NAMES.length,
            i;
        for (i = 0; i < namesLen; i += 1) {
            try {
                context = canvas.getContext(WEBGL_NAMES[i], options);
            }
            catch (e) {
            }
            if (context) {
                break;
            }
        }
        return context;
    },

    _addCreationListener = (canvas, onError) => {
        onError = onError || function () {
            error('WebGl unsupported.');
            alert('WebGl unsupported.');
        };
        if (!canvas.addEventListener) {
            canvas.addEventListener(webGlCreationErrorEventName, function (event) {
                onError(event.statusMessage);
            }, false);
        }
    }
;