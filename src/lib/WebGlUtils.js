/**
 * Created by edlc on 11/27/16.
 */
(function() {

    'use strict';

    const
        __ = sjl._,
        curry = sjl.curry,
        WEBGL_NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
        webGlCreationErrorEventName = 'webglcontextcreationerror',
        log = console.log.bind(console);

    function initShaders (gl, vshader, fshader) {
        var program = createProgram(gl, vshader, fshader);
        if (!program) {
            console.log('Failed to create program');
            return false;
        }
        gl.useProgram(program);
        gl.program = program;
        return true;
    }

    function createProgram (gl, vshader, fshader) {
        // Create shader object
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        // Create a program object
        var program = gl.createProgram();
        if (!program) {
            return null;
        }

        // Attach the shader objects
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // Link the program object
        gl.linkProgram(program);

        // Check the result of linking
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var error = gl.getProgramInfoLog(program);
            log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    }

    function loadShader(gl, type, source) {
        // Create shader object
        var shader = gl.createShader(type);
        if (!shader) {
            log('unable to create shader');
            return null;
        }

        // Set the shader program
        gl.shaderSource(shader, source);

        // Compile the shader
        gl.compileShader(shader);

        // Check the result of compilation
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(shader);
            log('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function getWebGlContext (canvas, options, onError) {
        _addCreationListener(canvas, onError);
        var context = null,
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

    function _addCreationListener (canvas, onError) {
        onError = onError || function () {alert('WebGl unsupported.');};
        if (canvas.addEventListener) {
            canvas.addEventListener(webGlCreationErrorEventName, function(event) {
                onError(event.statusMessage);
            }, false);
        }
    }

    Object.defineProperty(window, 'WebGlUtils', {
        value: Object.defineProperties({}, {
            getWebGlContext: {value: getWebGlContext, enumerable: true},
            createProgram: {value: createProgram, enumerable: true},
            initShaders: {value: initShaders, enumerable: true},
            loadShader: {value: loadShader, enumerable: true}
        }),
        enumerable: true
    });

}());
