import {GLBufferType, GLDataType} from "./webgl";

export interface GLx extends WebGLRenderingContext {
  program: WebGLProgram
}

export interface GLBufferInfo {
  buffer: WebGLBuffer;
  numParts: number;
  vertAttribType: GLDataType
  bufferType: GLBufferType
}

export interface GLTriangleInfo {
  vertexBuffer: GLBufferInfo,
  colorBuffer: GLBufferInfo,
  indexBuffer: GLBufferInfo,
  numIndices: number,
  modelMatrix: [number, number, number, number];
}

export interface GLFrameBufferInfo {
  texture?: WebGLTexture,
  framebuffer?: WebGLFramebuffer,
  renderbuffer?: WebGLRenderbuffer,
}

export interface GLProgramInfo {
  attributeNames?: string[],
  uniformName?: string[],
  program?: WebGLProgram,

  getShaderAssociationList(gl: WebGLRenderingContext): any[],

  setStaticUniforms(progInfo: GLProgramInfo, worldInfo: GLProgramInfo, gl: WebGLRenderingContext): void,

  initialize(programInfo, worldInfo, gl: WebGLRenderingContext): boolean
}
