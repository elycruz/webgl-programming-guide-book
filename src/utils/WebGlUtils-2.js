/**
 * Created by elyde on 11/29/2016.
 */
import {curry, compose} from 'fjl';
import {error} from '../../src/utils/utils';

export const

    WEBGL_NAMES = Object.freeze(["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]),

    webGlCreationErrorEventName = 'webglcontextcreationerror',

    toRadians = deg => Math.PI * deg / 180.0,

    isPowerOf2 = x => (x & (x - 1)) === 0,

    getUniformLoc = (gl, locName) => gl.getUniformLocation(gl.program, locName),

    getAttribLoc = (gl, locName) => gl.getAttribLocation(gl.program, locName),

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

    onTextureImageLoad = e => {
        const image = e.currentTarget,
            {gl, texture, level, internalFormat, srcFormat, srcType} = e.detail;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image
        );

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    },

    loadTexture = (gl, uri, onLoad = (() => (undefined))) => {
        const texture = gl.createTexture(),
            level = 0,
            width = 1,
            height = 1,
            border = 0,
            internalFormat = gl.RGBA,
            srcFormat = gl.RGBA,
            srcType = gl.UNSIGNED_BYTE,
            pixel = new Uint8Array([0, 0, 255, 255]), // opaque blue
            image = new Image(),
            onImageLoad = e => {
                e.detail = {
                    gl, texture, level,
                    internalFormat, srcFormat, srcType
                };
                onTextureImageLoad(e);
                onLoad(e);
                image.removeEventListener('load', onImageLoad);
            };
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType, pixel);
        image.addEventListener('load', onImageLoad);
        image.src = uri;
        return texture;
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



