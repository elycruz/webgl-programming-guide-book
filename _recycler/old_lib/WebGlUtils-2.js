/**
 * Created by elyde on 11/29/2016.
 */
(function () {

    'use strict';

    const
        __ = sjl._,
        curry = sjl.curry,
        WEBGL_NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
        webGlCreationErrorEventName = 'webglcontextcreationerror',
        log = console.log.bind(console);

    function initProgram (gl, shaderConfigs) {
        var program = compileProgram(gl, shaderConfigs);
        if (!program) {
            return program;
        }
        gl.useProgram(program);
        gl.program = program;
        return program;
    }

    function compileProgram (gl, shaderConfigs) {
        var program = gl.createProgram(),
            shaders = compileShaders(gl, shaderConfigs);
        sjl.compose(gl.linkProgram.bind(gl), curry(attachShaders, gl, __, shaders))(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            log('Failed to link program: ' + gl.getProgramInfoLog(program)); // show failure message
            gl.deleteProgram(program);
            deleteShaders(gl, shaders);
            return null;
        }
        return program;
    }

    function attachShaders (gl, program, shaders) {
        shaders.forEach(function (shader) {
            gl.attachShader(program, shader);
        });
        return program;
    }

    function deleteShaders (gl, shaders) {
        shaders.forEach(function (shader) {
            gl.deleteShader(shader);
        });
    }

    function compileShaders (gl, shaderTypeAndSourceTuples) {
        return shaderTypeAndSourceTuples.map(function (tuple) {
            var shader = gl.createShader(tuple[0]),
                compiledSuccessfully,
                error;
            gl.shaderSource(shader, tuple[1]);
            gl.compileShader(shader);
            compiledSuccessfully = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiledSuccessfully) {
                error = gl.getShaderInfoLog(shader);
                log('Failed to compile shader: ' + error);
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        })
            .filter(function (shader) {
                return !!shader;
            });
    }

    function getWebGlContext (canvas, options, onError) {
        _addWebGLCreationListener_(canvas, onError);
        var context,
            namesLen = WEBGL_NAMES.length,
            i;
        for (i = 0; i < namesLen; i += 1) {
            try {
                context = canvas.getContext(WEBGL_NAMES[i], options);
            }
            catch(e) {}
            if (context) {
                break;
            }
        }
        return context;
    }

    function _addWebGLCreationListener_ (canvas, onError) {
        onError = onError || function () {alert('WebGl unsupported.');};
        if (canvas.addEventListener) {
            canvas.addEventListener(webGlCreationErrorEventName, function(event) {
                onError(event.statusMessage);
            }, false);
        }
    }
    //
    // function Functor (value) {
    //     if (!this) {
    //         return new Functor(value);
    //     }
    //     Object.defineProperty(this, 'value', {
    //         value: value,
    //         writable: true
    //     });
    // }
    //
    // Functor.prototype.map = function (fn) {
    //     return new this.constructor(fn(this.value));
    // };
    //
    // WebGlUtils.Functor = Functor;

    Object.defineProperty(window, 'WebGlUtils', {
        value: Object.defineProperties({}, {
            getWebGlContext: {value: getWebGlContext, enumerable: true},
            compileProgram: {value: compileProgram, enumerable: true},
            compileShaders: {value: compileShaders, enumerable: true},
            attachShaders: {value: attachShaders, enumerable: true},
            deleteShaders: {value: deleteShaders, enumerable: true},
            initProgram: {value: initProgram, enumerable: true},
            toRadians: {value: function (degrees) { return Math.PI * degrees / 180.0; }, enumerable: true},
            uniformLoc: {value: function (gl, locName) { return gl.getUniformLocation(gl.program, locName); }, enumerable: true},
            attribLoc: {value: function (gl, locName) { return gl.getAttribLocation(gl.program, locName); }, enumerable: true},
        }),
        enumerable: true
    });



}());
