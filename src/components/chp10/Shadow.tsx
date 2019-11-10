import React from 'react';
import {mat4, vec3} from 'gl-matrix';
import {error} from '../../utils/utils';
import {
  getWebGlContext, initPrograms,
  initBufferNoEnable,
  toRadians, initAttributeVar, initElementArrayBufferNoEnable

} from "../../utils/WebGlUtils-2";
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";
import rafLimiter from "../../utils/raqLimiter";
import {GLFrameBufferInfo} from "../../types";

const
  lightX = 0,
  lightY = 7,
  lightZ = 2,
  offscreenW = 256,
  offscreenH = 256,

  shadowVertShader = `
        attribute vec4 a_Position;
        uniform mat4 u_MvpMatrix;
        void main () {
            gl_Position = u_MvpMatrix * a_Position;
        }
    `,

  shadowFragShader = `
        precision mediump float;
        void main () {
            gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0);
        }
    `,

  normalVertShader = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_MvpMatrixFromLight;
        varying vec4 v_PositionFromLight;
        varying vec4 v_Color;
        void main () {
            gl_Position = u_MvpMatrix * a_Position;
            v_PositionFromLight = u_MvpMatrix * a_Position;
            v_Color = a_Color;
        }
    `,

  normalFragShader = `
        precision mediump float;
        uniform sampler2D u_ShadowMap;
        varying vec4 v_PositionFromLight;
        varying vec4 v_Color;
        void main () {
            vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
            vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
            float depth = rgbaDepth.r;
            float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;
            gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
        }
    `,

  createTriangleInfo = gl => {
    const vertices = new Float32Array([-0.8, 3.5, 0.0, 0.8, 3.5, 0.0, 0.0, 3.5, 1.8]),
      colors = new Float32Array([1.0, 0.5, 0.0, 1.0, 0.5, 0.0, 1.0, 0.0, 0.0]),
      indices = new Uint8Array([0, 1, 2]),
      out = {
        vertexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, vertices),
        colorBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, colors),
        indexBuffer: initElementArrayBufferNoEnable(gl, indices.length, indices),
        numIndices: indices.length,
        modelMatrix: mat4.create()
      };

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return out;
  },

  createPlaneInfo = gl => {
    const
      vertices = new Float32Array([
        3.0, -1.7, 2.5, -3.0, -1.7, 2.5, -3.0, -1.7, -2.5, 3.0, -1.7, -2.5    // v0-v1-v2-v3
      ]),
      colors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
      ]),
      indices = new Uint8Array([0, 1, 2, 0, 2, 3]),
      modelMatrix = mat4.create(),
      out = {
        vertexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, vertices),
        colorBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, colors),
        indexBuffer: initElementArrayBufferNoEnable(gl, indices.length, indices),
        modelMatrix,
        numIndices: indices.length
      };

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Set plane rotation/position
    mat4.rotate(modelMatrix, modelMatrix, toRadians(45.0), vec3.fromValues(0, 1, 1));
    return out;
  },

  createFrameBufferInfo = gl => {
    let framebuffer = gl.createFramebuffer(),
      texture = gl.createTexture(),
      renderbuffer = gl.createRenderbuffer(),
      failedAssocList = [
        ['framebuffer', framebuffer],
        ['texture', texture],
        ['renderbuffer', renderbuffer]
      ].filter(([_, buffer]) => !buffer),
      framebufferStatus;

    const out: GLFrameBufferInfo = {},
      errorCleanup = () => {
        if (framebuffer) gl.deleteFramebuffer(framebuffer);
        if (texture) gl.deleteTexture(texture);
        if (renderbuffer) gl.deleteRenderbuffer(renderbuffer);
      };

    // If errors exit
    if (failedAssocList.length) {
      errorCleanup();
      failedAssocList.forEach(([bufferName]) => {
        error(`Failed to create ${bufferName} buffer object`);
      });
      return undefined;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the object to target
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offscreenW, offscreenH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // Set outgoing components
    out.texture = texture;
    out.framebuffer = framebuffer;
    out.renderbuffer = renderbuffer;

    // Set render buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offscreenW, offscreenH);

    // Attach texture and render buffer to frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    // Check if frame buffer is configured correctly
    framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== framebufferStatus) {
      error(`Frame buffer object is not complete: ${framebufferStatus}`);
      errorCleanup();
      return undefined;
    }

    // Unbind frame buffer to allow binding it at render time
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return out;
  },

  drawTriangle = (progInfo, worldInfo, bufferInfo, viewProjMatrix, gl) => {
    mat4.rotateZ(bufferInfo.modelMatrix, bufferInfo.modelMatrix, worldInfo.g_angle);
    drawShape(progInfo, worldInfo, bufferInfo, viewProjMatrix, gl);
  },

  drawPlane = (progInfo, worldInfo, bufferInfo, viewProjMatrix, gl) => {
    drawShape(progInfo, worldInfo, bufferInfo, viewProjMatrix, gl);
  },

  drawShape = (progInfo, worldInfo, bufferInfo, viewProjMatrix, gl) => {
    const {attributes: {a_Color, a_Position}, uniforms: {u_MvpMatrix}} = progInfo;
    initAttributeVar(gl, a_Position, bufferInfo.vertexBuffer);
    if (a_Color) {
      initAttributeVar(gl, a_Color, bufferInfo.colorBuffer);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indexBuffer);
    gl.uniformMatrix4fv(u_MvpMatrix, false,
      new Float32Array(mat4.multiply(
        mat4.create(),
        viewProjMatrix,
        bufferInfo.modelMatrix
      ))
    );
    gl.drawElements(gl.TRIANGLES, bufferInfo.numIndices, gl.UNSIGNED_BYTE, 0);
  },

  toDrawCallback = (programs, worldInfo, gl) => delta => {
    const [shadowProgInfo, normalProgInfo] = programs,
      {viewProjMatrixFromLight, viewProjMatrix, canvasElm} = worldInfo,
      {
        uniforms: {u_ShadowMap, u_MvpMatrixFromLight},
        triangleInfo, planeInfo
      } = normalProgInfo;
    worldInfo.g_angle = (delta * 0.001) % 360.0;

    // Prepare to draw shadow portion of program
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowProgInfo.fboBufferInfo.framebuffer); // Change the drawing destination to FBO
    gl.viewport(0, 0, offscreenW, offscreenH); // Set view port for FBO
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear FBO
    gl.useProgram(shadowProgInfo.program); // Set shadow program

    // Draw shadow shapes
    drawTriangle(shadowProgInfo, worldInfo, triangleInfo, viewProjMatrixFromLight, gl);
    drawPlane(shadowProgInfo, worldInfo, planeInfo, viewProjMatrixFromLight, gl);

    // Prepare to draw color shapes
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); // clear previous buffered data
    gl.viewport(0, 0, canvasElm.width, canvasElm.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Begin drawing
    gl.useProgram(normalProgInfo.program);
    gl.uniform1i(u_ShadowMap, 0);

    gl.uniform4fv(u_MvpMatrixFromLight, triangleInfo.modelMatrix);
    drawTriangle(normalProgInfo, worldInfo, triangleInfo, viewProjMatrix, gl);

    gl.uniform4fv(u_MvpMatrixFromLight, planeInfo.modelMatrix);
    drawPlane(normalProgInfo, worldInfo, planeInfo, viewProjMatrix, gl);

    // Clear then draw
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    // // gl.enable(gl.POLYGON_OFFSET_FILL);
    // gl.polygonOffset(1.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },

  init = (programConfs, canvasElm, gl) => {
    // Used for triangle and shadow rotation
    let g_angle = 90.0;
    const
      // Uniform values
      eye = vec3.fromValues(0.0, 7.0, 9.0),  //  x   y   z - Get converted to floating point
      currFocal = vec3.fromValues(0, 0, 0),
      upFocal = vec3.fromValues(0, 1, 0),
      lightDirection = vec3.fromValues(lightX, lightY, lightZ),

      // Projection
      viewProjMatrixFromLight = mat4.create(),
      viewProjMatrix = mat4.create(),
      g_mvpMatrix = mat4.create(),
      mvpMatrixFromLight_Triangle = mat4.create(),
      mvpMatrixFromLight_Plane = mat4.create(),
      worldInfo = {
        g_mvpMatrix, g_angle,
        eye, currFocal, upFocal, lightDirection,
        viewProjMatrixFromLight, viewProjMatrix,
        mvpMatrixFromLight_Plane, canvasElm,
        mvpMatrixFromLight_Triangle
      },
      programs = initPrograms(programConfs, worldInfo, gl)
    ;

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    // Normalize light direction
    vec3.normalize(lightDirection, lightDirection);

    // View projection from light source
    mat4.lookAt(
      viewProjMatrixFromLight,
      vec3.fromValues(lightX, lightY, lightZ), currFocal, upFocal
    );
    mat4.perspective(
      viewProjMatrixFromLight,
      toRadians(70.0), offscreenW / offscreenH, 1, 100
    );

    // Regular view projection
    mat4.lookAt(viewProjMatrix, eye, currFocal, upFocal);
    mat4.perspective(viewProjMatrix, toRadians(45), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);

    // Kick-off animation loop
    rafLimiter(toDrawCallback(programs, worldInfo, gl), 144);
  },

  programConfigs = [
    {   // Shadow program
      attributeNames: ['a_Position'],
      uniformNames: ['u_MvpMatrix'],
      getShadersAssocList: gl => [
        [gl.VERTEX_SHADER, shadowVertShader],
        [gl.FRAGMENT_SHADER, shadowFragShader]
      ],
      init: (progInfo, worldInfo, gl) => {
        progInfo.fboBufferInfo = createFrameBufferInfo(gl);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, progInfo.fboBufferInfo.texture);
        return !!progInfo.fboBufferInfo;
      }
    },
    {   // Normal program
      attributeNames: [
        'a_Position',
        'a_Color'
      ],
      uniformNames: [
        'u_MvpMatrix',
        'u_MvpMatrixFromLight',
        'u_ShadowMap'
      ],
      getShadersAssocList: gl => [
        [gl.VERTEX_SHADER, normalVertShader],
        [gl.FRAGMENT_SHADER, normalFragShader]
      ],
      init: (progInfo, worldInfo, gl) => {
        progInfo.triangleInfo = createTriangleInfo(gl);
        progInfo.planeInfo = createPlaneInfo(gl);
        return [progInfo.triangleInfo, progInfo.planeInfo].every(x => !!x);
      }
    }
  ]
;

export default class Shadow extends GenericCanvasExperimentView {
  static defaultProps = {
    aliasName: 'shadow',
    canvasId: 'shadow-canvas',
    fileName: 'Shadow.tsx'
  };

  componentDidMount() {
    const
      canvasElm =
        this.canvasElm =
          this.canvas.current,
      gl = getWebGlContext(canvasElm)
    ;
    init(programConfigs, canvasElm, gl);
  }

  render() {
    const {props: {fileName, canvasId}} = this;
    return (
      <div>
        <header>
          <h3>{fileName}</h3>
        </header>
        <canvas width="610" height="377"
                id={canvasId} ref={this.canvas}>
          <p>Html canvas element not supported</p>
        </canvas>
      </div>
    );
  }

}
