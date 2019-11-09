import React from 'react';
import {mat4, vec3} from 'gl-matrix';
import {range} from 'fjl';
import {keys} from 'fjl';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram,
    initBufferNoEnable,
    toRadians, loadTexture, initAttributeVar, initBufferNoEnable1
} from "../../utils/WebGlUtils-2";
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";
import rafLimiter from "../../utils/raqLimiter";
import textureImg from '../../assets/sky_cloud.jpg';
import vertShader from '../../assets/fboVertexShader.js';
import fragShader from '../../assets/fboFragmentShader.js';

let stopAniFrame = false;

const

    // Offscreen buffer width
    offscreenWidth = 256,

    // Offscreen buffer height
    offscreenHeight = 256,

    createCubeBuffersInfo = (progInfo, worldInfo, gl) => {
        const
            vertices = new Float32Array([   // Vertex coordinates
                1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
                1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
                -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
                -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
                1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
            ]),
            indices = new Uint8Array([       // Indices of the vertices
                0, 1, 2, 0, 2, 3,    // front
                4, 5, 6, 4, 6, 7,    // right
                8, 9, 10, 8, 10, 11,    // up
                12, 13, 14, 12, 14, 15,    // left
                16, 17, 18, 16, 18, 19,    // down
                20, 21, 22, 20, 22, 23     // back
            ]),
            normals = new Float32Array([    // Normal
                0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
                0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
                -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
                0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
                0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
            ]),
            texCoords = new Float32Array([   // Texture coordinates
                1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
                0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
                1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
                1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
                0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
                0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
            ]),
            modelMatrix = mat4.create(),
            out = {
                vertexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, vertices),
                normalBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, normals),
                texCoordBuffer: initBufferNoEnable(gl, gl.FLOAT, 2, texCoords),
                indexBuffer: initBufferNoEnable1(gl, gl.ELEMENT_ARRAY_BUFFER, gl.FLOAT, gl.STATIC_DRAW, indices.length, indices),
                texture: loadTexture(gl, textureImg, () => {
                    gl.useProgram(progInfo.program);
                    gl.uniform1i(progInfo.uniforms.u_Sampler, 0);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }),
                modelMatrix: modelMatrix
            }
        ;
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(2, 2, 2));
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        out.numIndices = keys(out).some(k => !out[k]) ? -1 : indices.length;
        return out;
    },

    createPlaneBuffersInfo = (progInfo, worldInfo, gl) => {
        const
            // Vertex coordinates
            vertices = new Float32Array([
                1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0    // v0-v1-v2-v3
            ]),

            // Texture coordinates
            texCoords = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]),

            // Indices of the vertices
            indices = new Uint8Array([0, 1, 2, 0, 2, 3]),

            viewProjMatrix = mat4.create(),
            modelMatrix = mat4.create(),
            {canvasElm, eye, currFocal, upFocal} = worldInfo,

            out = {
                vertexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, vertices),
                texCoordBuffer: initBufferNoEnable(gl, gl.FLOAT, 2, texCoords),
                indexBuffer: initBufferNoEnable1(gl, gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_BYTE, gl.STATIC_DRAW, indices.length, indices),
                modelMatrix,
                viewProjMatrix
            }
        ;

        // Set up view projection
        mat4.lookAt(viewProjMatrix, eye, currFocal, upFocal);
        mat4.perspective(viewProjMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);

        // Set up model
        // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -10));
        mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(3, 3, 3));

        out.numIndices = keys(out).some(k => !out[k]) ? -1 : indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return out;
    },

    createFrameBufferInfo = (progInfo, worldInfo, gl) => {
        let framebuffer = gl.createFramebuffer(),
            texture = gl.createTexture(),
            renderbuffer = gl.createRenderbuffer(),
            failedAssocList = [
                ['framebuffer', framebuffer],
                ['texture', texture],
                ['renderbuffer', renderbuffer]
            ].filter(([_, buffer]) => !buffer),
            framebufferStatus;

        const out = {},
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
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offscreenWidth, offscreenHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // Set outgoing components
        out.texture = texture;
        out.framebuffer = framebuffer;
        out.renderbuffer = renderbuffer;

        // Set render buffer
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offscreenWidth, offscreenHeight);

        // Attach texture and render buffer to frame buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

        // Check if frame buffer is configured correctly
        framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (gl.FRAMEBUFFER_COMPLETE !== framebufferStatus) {
            // error(`Frame buffer object is not complete: ${framebufferStatus}`);
            // errorCleanup();
            // return undefined;
        }

        // Unbind frame buffer to allow binding it at render time
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return out;
    },

    drawTexturedObj = (progInfo, worldInfo, bufferInfo, gl) => {
        const {
                attributes: {a_Position, a_TexCoord}
            } = progInfo,
            {
                vertexBuffer, texCoordBuffer, texture, indexBuffer,
                modelMatrix
            } = bufferInfo;
        const {u_MvpMatrix, u_NormalMatrix, u_ModelMatrix} = progInfo.uniforms,
            {g_mvpMatrix, g_normalMatrix,
                g_viewMatrix, g_projMatrix, g_angle} = worldInfo;

        mat4.rotateY(modelMatrix, modelMatrix, g_angle);
        // mat4.rotateY(modelMatrix, modelMatrix, g_angle);

        // Magic Matrix: Inverse transpose matrix (for affecting normals on
        //  shape when translating, scaling etc.)
        mat4.copy(g_normalMatrix, modelMatrix);
        mat4.invert(g_normalMatrix, g_normalMatrix);
        mat4.transpose(g_normalMatrix, g_normalMatrix);

        mat4.multiply(g_mvpMatrix, g_projMatrix, g_viewMatrix);
        mat4.multiply(g_mvpMatrix, g_mvpMatrix, modelMatrix);

        gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix);
        gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

        initAttributeVar(gl, a_Position, vertexBuffer);
        initAttributeVar(gl, a_TexCoord, texCoordBuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indexBuffer.numParts, gl.UNSIGNED_BYTE, 0);
    },

    drawTexturedCube = (progInfo, worldInfo, gl) => {
        const {
            attributes: {a_Position, a_Normal, a_TexCoord},
            cubeBufferInfo,
            cubeBufferInfo: {
                vertexBuffer, normalBuffer, texCoordBuffer, indexBuffer
            }
        } = progInfo;

        // Set attribute buffers
        initAttributeVar(gl, a_Position, vertexBuffer);
        initAttributeVar(gl, a_Normal, normalBuffer);
        initAttributeVar(gl, a_TexCoord, texCoordBuffer);

        // Bind vertex index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // Draw cube
        drawTexturedObj(progInfo, worldInfo, cubeBufferInfo, gl);
    },

    drawTexturedPlane = (progInfo, worldInfo, gl) => {
        progInfo.planeBufferInfo.texture = progInfo.fboBufferInfo.texture;
        drawTexturedObj(progInfo, worldInfo, progInfo.planeBufferInfo, gl);
    },

    setSharedStaticUniforms = (progInfo, worldInfo, gl) => {
        const
            {u_Eye, u_FogColor, u_FogDist,
                u_LightColor, u_AmbientLight, u_LightPosition,
                u_LightDirection} = progInfo.uniforms,
            {eyeF32, fogColor, fogDist, lightDirection} = worldInfo;
        gl.uniform4fv(u_Eye, eyeF32);
        gl.uniform3fv(u_FogColor, fogColor);
        gl.uniform2fv(u_FogDist, fogDist);
        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_AmbientLight, 0.3, 0.3, 0.3);
        gl.uniform3f(u_LightPosition, 0.0, 21.0, 21.0);
        gl.uniform3fv(u_LightDirection, lightDirection);
    },

    programInfo = {
        attributeNames: [
            'a_Position',
            'a_Normal',
            'a_TexCoord'
        ],
        uniformNames: [
            'u_MvpMatrix',
            'u_NormalMatrix',
            'u_ModelMatrix',
            'u_LightColor',
            'u_LightDirection',
            'u_LightPosition',
            'u_AmbientLight',
            'u_Eye',
            'u_FogColor',
            'u_FogDist',
            'u_Sampler'
        ],
        getShadersAssocList: gl => [
            [gl.VERTEX_SHADER, vertShader],
            [gl.FRAGMENT_SHADER, fragShader]
        ],
        init: (progInfo, worldInfo, gl) => {
            progInfo.cubeBufferInfo = createCubeBuffersInfo(progInfo, worldInfo, gl);
            progInfo.planeBufferInfo = createPlaneBuffersInfo(progInfo, worldInfo, gl);
            progInfo.fboBufferInfo = createFrameBufferInfo(progInfo, worldInfo, gl);
            progInfo.cubeBufferInfo.viewProjMatrix = worldInfo.g_viewMatrix;
            return ![progInfo.cubeBufferInfo, progInfo.planeBufferInfo, progInfo.fboBufferInfo].some(x => !x);
        },
        setStaticUniforms: setSharedStaticUniforms
    }
;

export default class FramebufferObject extends GenericCanvasExperimentView {
    static defaultProps = {
        aliasName: 'program-object',
        canvasId: 'program-object-canvas',
        fileName: 'ProgramObject.jsx'
    };

    componentDidMount () {
        let g_angle = 90.0;

        const
            canvasElm = this.canvas.current,
            gl = getWebGlContext(canvasElm),

            // Uniform values
            fogColor = new Float32Array([0.137, 0.231, 0.423]),
            fogDist = new Float32Array([13, 15]),
            fogColorWith4th = new Float32Array( Array.from(fogColor).concat([1.0]) ),
            eye = vec3.fromValues(0,  0,  13),  //  x   y   z - Get converted to floating point
            eyeF32 = new Float32Array([0, 0, 13, 1.0]),
            currFocal = vec3.fromValues(0,  0,  0),
            upFocal = vec3.fromValues(0,  1,  0),
            lightDirection = vec3.fromValues(0.0, 3.0, 4.0),

            // Projection
            g_viewMatrix =  mat4.create(),
            g_projMatrix =  mat4.create(),
            g_normalMatrix = mat4.create(),
            g_mvpMatrix = mat4.create(),

            worldInfo = {
                g_mvpMatrix, g_normalMatrix, g_viewMatrix, g_projMatrix, g_angle, canvasElm,
                fogColor, fogDist, fogColorWith4th, eye, eyeF32, currFocal, upFocal, lightDirection
            },

            program =
                programInfo.program =
                    initProgram(gl, programInfo.getShadersAssocList(gl));

        if (!program) {
            error('Error while creating and linking program.');
            return programInfo;
        }

        // Get uniform locations
        programInfo.uniforms = programInfo.uniformNames.reduce((agg, name) => {
            agg[name] = gl.getUniformLocation(program, name);
            return agg;
        }, {});

        // Get attributes locations
        programInfo.attributes = programInfo.attributeNames.reduce((agg, name) => {
            agg[name] = gl.getAttribLocation(program, name);
            return agg;
        }, {});

        if (!programInfo.init(programInfo, worldInfo, gl)) {
            error('Error while initializing buffers.');
        }

        // Initialize static uniforms
        programInfo.setStaticUniforms(programInfo, worldInfo, gl);

        vec3.normalize(lightDirection, lightDirection);
        mat4.lookAt(g_viewMatrix, eye, currFocal, upFocal);
        mat4.perspective(g_projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        stopAniFrame = false;

        const draw = delta => {
            worldInfo.g_angle =
                g_angle = (delta * 0.001) % 360.0;

            const {fboBufferInfo: {framebuffer}} = programInfo;

            // Set frame buffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            // Set frame buffer viewport
            gl.viewport(0, 0, offscreenWidth, offscreenHeight);

            // Clear drawing
            gl.clearColor.apply(gl, fogColorWith4th);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Draw textured cube
            drawTexturedCube(programInfo, worldInfo, gl);

            // Clear framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            // Change viewport
            gl.viewport(0, 0, canvasElm.width, canvasElm.height);

            // Clear gl
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Draw textured plane
            drawTexturedPlane(programInfo, worldInfo, gl);

            // Animation stopper
            return stopAniFrame;
        };

        this.canvasElm = canvasElm;
        rafLimiter(draw);
    }

    componentWillUnmount () {
        stopAniFrame = true;
    }

    render () {
        const {props} = this;
        return (
            <div>
                <header>
                    <h3>{props.fileName}</h3>
                </header>
                <p>Framebuffer texture for rectangle (cube is being rendered into
                    frame buffer then outputted as a texture and applied to square).
                Note:  The darkside of the rectangle is due to 'fog-effect' being applied via the same shader</p>
                <canvas width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            </div>
        );
    }
}
