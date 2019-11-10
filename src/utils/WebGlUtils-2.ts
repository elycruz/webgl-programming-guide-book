/**
 * Created by elyde on 11/29/2016.
 */
import {compose, error} from 'fjl';
import {GLx, WebGLAttributeLocation} from "../types";

export const

  WEBGL_NAMES = Object.freeze(["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"]),

  webGlCreationErrorEventName = 'webglcontextcreationerror',

  toRadians = (deg: number): number => Math.PI * deg / 180.0,

  isPowerOf2 = (x: number): boolean => (x & (x - 1)) === 0,

  toUniformLoc = (gl: GLx, locName: string): WebGLUniformLocation =>
    gl.getUniformLocation(gl.program, locName),

  toAttribLoc = (gl: GLx, locName: string): WebGLAttributeLocation =>
    gl.getAttribLocation(gl.program, locName),

  initProgram = (gl: GLx, shadersAssocList): WebGLProgram => {
    let program = compileProgram(gl, shadersAssocList);
    if (!program) {
      return program;
    }
    gl.useProgram(program);
    gl.program = program;
    return program;
  },

  initPrograms = (programConfigs, worldInfo, gl: GLx) => programConfigs.map(progInfo => {
    const program = initProgram(gl, progInfo.getShadersAssocList(gl));
    progInfo.program = program;

    if (!program) {
      error('Error while creating and linking program.');
      return progInfo;
    }

    if (!progInfo.init(progInfo, worldInfo, gl)) {
      error('Error while initializing program.');
    }

    // Get uniform locations
    if (progInfo.uniformNames) {
      progInfo.uniforms = progInfo.uniformNames.reduce((agg, name) => {
        agg[name] = gl.getUniformLocation(progInfo.program, name);
        return agg;
      }, {});
    }

    // Get attributes locations
    if (progInfo.attributeNames) {
      progInfo.attributes = progInfo.attributeNames.reduce((agg, name) => {
        agg[name] = gl.getAttribLocation(progInfo.program, name);
        return agg;
      }, {});
    }

    // Initialize static uniforms
    if (progInfo.setStaticUniforms) {
      progInfo.setStaticUniforms(progInfo, worldInfo, gl);
    }

    return progInfo;
  }),

  compileProgram = (gl, shadersAssocList): WebGLProgram => {
    let program = gl.createProgram(),
      shaders = compileShaders(gl, shadersAssocList);
    compose(gl.linkProgram.bind(gl), p => attachShaders(gl, shaders, p))(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      error('Failed to link program: ' + gl.getProgramInfoLog(program)); // show failure message
      gl.deleteProgram(program);
      deleteShaders(gl, shaders);
      return null;
    }
    return program;
  },

  attachShaders = (gl, shaders, program): WebGLProgram => {
    shaders.forEach(shader => gl.attachShader(program, shader));
    return program;
  },

  deleteShaders = (gl, shaders): void => {
    shaders.forEach(shader => gl.deleteShader(shader));
  },

  compileShaders = (gl, shaderTypeAndSourceTuples): WebGLShader[] => {
    return shaderTypeAndSourceTuples.map(tuple => {
      let shader: WebGLShader = gl.createShader(tuple[0]),
        compiledSuccessfully,
        err;
      gl.shaderSource(shader, tuple[1]);
      gl.compileShader(shader);
      compiledSuccessfully = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!compiledSuccessfully) {
        err = gl.getShaderInfoLog(shader);
        error('Failed to compile shader: Error received: ' + err);
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    })
      .filter(shader => !!shader);
  },

  initBufferWithData = (gl, bufferType, numParts, attribType, attribName, bufferData, stride = 0, offset = 0) => {
    const buffer = gl.createBuffer(),
      a_Attrib = toAttribLoc(gl, attribName);
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, bufferData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Attrib, numParts, attribType || gl.FLOAT, false, stride, offset);
    gl.enableVertexAttribArray(a_Attrib);
    return !!buffer;
  },

  initBufferNoEnable = (gl, vertAttribType, numParts, bufferData) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    if (!buffer) {
      error('Failed to create buffer for later use');
      return;
    }
    buffer.numParts = numParts;
    buffer.vertAttribType = vertAttribType;
    buffer.bufferType = gl.ARRAY_BUFFER;
    return buffer;
  },

  initAttributeVar = (gl, attributePointer, buffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attributePointer, buffer.numParts, buffer.vertAttribType, false, 0, 0);
    gl.enableVertexAttribArray(attributePointer);
  },

  initBufferNoEnable1 = (
    gl,
    bufferType,
    vertAttribType,
    usageType,
    numParts,
    bufferData
  ) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, bufferData, usageType);
    if (!buffer) {
      error('Falied to create buffer for later use');
      return;
    }
    buffer.numParts = numParts;
    buffer.vertAttribType = vertAttribType;
    buffer.bufferType = bufferType;
    return buffer;
  },

  initElementArrayBufferNoEnable = (
    gl,
    numParts,
    bufferData
  ) => {
    const
      buffer = gl.createBuffer(),
      bufferType = gl.ELEMENT_ARRAY_BUFFER,
      usageType = gl.STATIC_DRAW,
      vertAttribType = gl.UNSIGNED_BYTE
    ;
    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, bufferData, usageType);
    if (!buffer) {
      error('Falied to create buffer for later use');
      return;
    }
    buffer.numParts = numParts;
    buffer.vertAttribType = vertAttribType;
    buffer.bufferType = bufferType;
    return buffer;
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
    } else {
      // No, it's not a power of 2. Turn of mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  },

  loadTexture = (gl, uri, onLoad = (e: Event) => undefined) => {
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
      onImageLoad = (e: Event) => {
        // @ts-ignore - @todo change this (since event is generic here).
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

  getWebGlContext = (canvas: HTMLCanvasElement, options?: object, onError?: (e: Event) => void): WebGLRenderingContext => {
    addWebGLCreationListener(canvas, onError);
    let context,
      namesLen = WEBGL_NAMES.length,
      i;
    for (i = 0; i < namesLen; i += 1) {
      try {
        context = canvas.getContext(WEBGL_NAMES[i], options);
      } catch (e) {
      }
      if (context) {
        break;
      }
    }
    return context;
  },

  addWebGLCreationListener = (canvas, onError: (e: Event) => void = () => {
    error('WebGl unsupported');
    alert('WebGl unsupported.');
  }) => {
    canvas.addEventListener(webGlCreationErrorEventName, (event: WebGLContextEvent) => {
        // @ts-ignore - Interface (for `WebGLContextEvent`) not properly setup for typescript.
        onError(event.statusMessage || 'Unknown error');
        canvas.removeEventListener(webGlCreationErrorEventName);
      },
      false
    );
  }
;
