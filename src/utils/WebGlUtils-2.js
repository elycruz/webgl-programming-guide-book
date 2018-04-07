/**
 * Created by elyde on 11/29/2016.
 */
import {curry, compose} from 'fjl';
import {error} from '../../src/utils/utils';

export const

    WEBGL_NAMES = Object.freeze(["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]),

    webGlCreationErrorEventName = 'webglcontextcreationerror',

    toRadians = deg => Math.PI * deg / 180.0,

    uniformLoc = (gl, locName) => gl.getUniformLocation(gl.program, locName),

    attribLoc = (gl, locName) => gl.getAttribLocation(gl.program, locName),

    initProgram = (gl, shadersAssocList) => {
        let program = compileProgram(gl, shadersAssocList);
        if (!program) {
            return program;
        }
        gl.useProgram(program);
        gl.program = program;
        return program;
    },

    compileProgram = (gl, shadersAssocList) => {
        let program = gl.createProgram(),
            shaders = compileShaders(gl, shadersAssocList);
        compose(gl.linkProgram.bind(gl), curry(attachShaders, gl, shaders))(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            error('Failed to link program: ' + gl.getProgramInfoLog(program)); // show failure message
            gl.deleteProgram(program);
            deleteShaders(gl, shaders);
            return null;
        }
        return program;
    },

    attachShaders = (gl, shaders, program) => {
        shaders.forEach(shader => gl.attachShader(program, shader));
        return program;
    },

    deleteShaders = (gl, shaders) => {
        shaders.forEach(shader => gl.deleteShader(shader));
    },

    compileShaders = (gl, shaderTypeAndSourceTuples) => {
        return shaderTypeAndSourceTuples.map(tuple => {
            let shader = gl.createShader(tuple[0]),
                compiledSuccessfully,
                err;
            gl.shaderSource(shader, tuple[1]);
            gl.compileShader(shader);
            compiledSuccessfully = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiledSuccessfully) {
                err = gl.getShaderInfoLog(shader);
                error('Failed to compile shader: ' + err);
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        })
        .filter(shader => !!shader);
    },

    getWebGlContext = (canvas, options, onError) => {
        addWebGLCreationListener(canvas, onError);
        let context,
            namesLen = WEBGL_NAMES.length,
            i;
        for (i = 0; i < namesLen; i += 1) {
            try { context = canvas.getContext(WEBGL_NAMES[i], options); }
            catch(e) {} if (context) { break; }
        }
        return context;
    },

    addWebGLCreationListener = (canvas, onError) => {
        onError = onError || (() => {
            error('WebGl unsupported');
            alert('WebGl unsupported.');
        });
        canvas.addEventListener(webGlCreationErrorEventName, event => {
                onError(event.statusMessage);
                canvas.removeEventListener(webGlCreationErrorEventName);
            },
            false
        );
    }

;



