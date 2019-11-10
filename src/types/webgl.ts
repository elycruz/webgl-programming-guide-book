/**
 * `Glenum` types.
 * @module types/webgl
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
 */

export const enum GLDataType {
  BYTE = 0x1400,
  UNSIGNED_BYTE = 0x1401,
  SHORT = 0x1402,
  UNSIGNED_SHORT = 0x1403,
  INT = 0x1404,
  UNSIGNED_INT = 0x1405,
  FLOAT = 0x1406,
}

export const enum GLBufferType {
  STATIC_DRAW = 0x88E4, // Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often.
  STREAM_DRAW = 0x88E0, // Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often.
  DYNAMIC_DRAW = 0x88E8, // Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often.
  ARRAY_BUFFER = 0x8892, // Passed to bindBuffer or bufferData to specify the type of buffer being used.
  ELEMENT_ARRAY_BUFFER = 0x8893, // Passed to bindBuffer or bufferData to specify the type of buffer being used.
  BUFFER_SIZE = 0x8764, // Passed to getBufferParameter to get a buffer's size.
  BUFFER_USAGE = 0x8765, // Passed to getBufferParameter to get the hint for the buffer passed in when it was created.
}

export const enum GLShaderType {
  FRAGMENT_SHADER = 0x8B30,
  VERTEX_SHADER = 0x8B31
}

// @note Since is missing from webgl spec (makes code clearer and easier to read instead of seeing `GLint` everywhere).
export type WebGLAttributeLocation = GLint;

