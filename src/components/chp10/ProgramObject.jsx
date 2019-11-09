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
import textureImg from '../../assets/orange.jpg'

const

    vertShader = `
        precision highp float;
        
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix;
        uniform mat4 u_ModelMatrix;
        uniform vec4 u_Eye;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying vec4 v_Color;
        varying float v_Dist;
        
        void main () {
            gl_Position = u_MvpMatrix * a_Position;
            
            v_Color = a_Color;
            
            // Calculate the world coordinate of the vertex
            v_Position = vec3(u_ModelMatrix * a_Position);
            
            // Recalculate normal with normal matrix and make length of normal '1.0'
            v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
            
            // Calculate distance for given vertex from eye
            // Using distance approximation using 'z' value of vertex 
            v_Dist = gl_Position.w; //  distance(u_ModelMatrix * a_Position, u_Eye);
        }`,

    fragShader = `
        precision highp float;
        
        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        uniform vec3 u_LightPosition;
        uniform vec3 u_AmbientLight;
        uniform vec3 u_FogColor;
        uniform vec2 u_FogDist;
        
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying vec4 v_Color;
        varying float v_Dist;
        
        void main () {
            float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
        
            // Calculate light direction and make it 1.0 in length
            vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));

            // Calculate the color due to ambient reflection
            vec3 ambient = u_AmbientLight * v_Color.rgb;
            
            // Dot product of light direction and orientation of a surface
            float nDotL = max(dot(lightDirection, v_Normal), 0.0);
            
            // Calculate color due to diffuse reflection
            vec3 diffuse = u_LightColor * vec3(v_Color.rgb) * nDotL;
            
            // Calculate color
            // u_FogColor * (1 - fogFactor) + v_Color * fogFactor
            vec3 fragColor = mix(u_FogColor, vec3(vec4(diffuse + ambient, v_Color.a)), fogFactor);

            // Mix fog in with frag color
            gl_FragColor = vec4(fragColor, v_Color.a);
        }`,

    vertShader2 =`
        precision highp float;
        
        attribute vec4 a_Position;
        attribute vec4 a_Normal;
        attribute vec2 a_TexCoord;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix;
        uniform mat4 u_ModelMatrix;
        uniform vec4 u_Eye;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying float v_Dist;
        
        varying float v_NdotL;
        varying vec2 v_TexCoord;
        
        void main() {
            gl_Position = u_MvpMatrix * a_Position;
            
            // Calculate the world coordinate of the vertex
            v_Position = vec3(u_ModelMatrix * a_Position);
            
            // Recalculate normal with normal matrix and make length of normal '1.0'
            v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
            
            // Calculate distance for given vertex from eye
            // Using distance approximation using 'z' value of vertex 
            v_Dist = gl_Position.w; //  distance(u_ModelMatrix * a_Position, u_Eye);
            
            v_TexCoord = a_TexCoord;
        }
        `
    ,

    fragShader2 = `
        precision highp float;
        
        uniform sampler2D u_Sampler;
        
        varying vec2 v_TexCoord;
        varying float v_NdotL;

        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        uniform vec3 u_LightPosition;
        uniform vec3 u_AmbientLight;
        uniform vec3 u_FogColor;
        uniform vec2 u_FogDist;
        
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying float v_Dist;
        
        void main() {
            float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
            vec4 v_Color = texture2D(u_Sampler, v_TexCoord);
        
            // Calculate light direction and make it 1.0 in length
            vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));

            // Calculate the color due to ambient reflection
            vec3 ambient = u_AmbientLight * v_Color.rgb;
            
            // Dot product of light direction and orientation of a surface
            float nDotL = max(dot(lightDirection, v_Normal), 0.0);
            
            // Calculate color due to diffuse reflection
            vec3 diffuse = u_LightColor * vec3(v_Color.rgb) * nDotL;
            
            // Calculate color
            // u_FogColor * (1 - fogFactor) + v_Color * fogFactor
            vec3 fragColor = mix(u_FogColor, vec3(vec4(diffuse + ambient, v_Color.a)), fogFactor);

            // Mix fog in with frag color
            gl_FragColor = vec4(fragColor, v_Color.a);
            
            // gl_FragColor = vec4(color.rgb * v_NdotL, color.a);
        }
    `,

    createCubeBuffersInfo = gl => {
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
            out = {
                vertexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, vertices),
                normalBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, normals),
                texCoordBuffer: initBufferNoEnable(gl, gl.FLOAT, 2, texCoords),
                indexBuffer: initBufferNoEnable1(gl, gl.ELEMENT_ARRAY_BUFFER, gl.FLOAT, gl.STATIC_DRAW, 3, indices)
            }
        ;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        out.numIndices = keys(out).some(k => !out[k]) ? -1 : indices.length;
        return out;
    },

    drawCube = (progInfo, worldInfo, gl) => {
        const {u_MvpMatrix, u_NormalMatrix, u_ModelMatrix} = progInfo.uniforms,
            {g_mvpMatrix, g_normalMatrix,
                g_viewMatrix, g_projMatrix, g_angle} = worldInfo,
            {modelMatrix} = progInfo.matrices;

        mat4.rotateX(modelMatrix, modelMatrix, g_angle);
        mat4.rotateY(modelMatrix, modelMatrix, g_angle);

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

        gl.drawElements(gl.TRIANGLES, progInfo.numCreatedVertices, gl.UNSIGNED_BYTE, 0);
    },

    setSharedStaticUniforms = (progInfo, statics, dynamics, gl) => {
        const
            {u_Eye, u_FogColor, u_FogDist,
                u_LightColor, u_AmbientLight, u_LightPosition,
                u_LightDirection} = progInfo.uniforms,
            {eyeF32, fogColor, fogDist, lightDirection} = statics;
        gl.uniform4fv(u_Eye, eyeF32);
        gl.uniform3fv(u_FogColor, fogColor);
        gl.uniform2fv(u_FogDist, fogDist);
        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_AmbientLight, 0.3, 0.3, 0.3);
        gl.uniform3f(u_LightPosition, 0.0, 21.0, 4.0);
        gl.uniform3fv(u_LightDirection, lightDirection);
    },
    programConfigs = [{
        attributeNames: [
            'a_Position',
            'a_Color',
            'a_Normal',
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
        ],
        getShadersAssocList: gl => [
            [gl.VERTEX_SHADER, vertShader],
            [gl.FRAGMENT_SHADER, fragShader]
        ],
        init: (progInfo, gl) => {
            const colors = new Float32Array([   // Colors
                    0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, // v0-v1-v2-v3 front
                    0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
                    0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, // v0-v5-v6-v1 up
                    0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61,  // v1-v6-v7-v2 left
                    0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, // v7-v4-v3-v2 down
                    0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, // v4-v7-v6-v5 back
                ]),
            modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(-2, 0, 0));
            progInfo.buffersInfo = createCubeBuffersInfo(gl);
            progInfo.buffersInfo.colorBuffer = initBufferNoEnable(gl, gl.FLOAT, 3, colors);

            progInfo.matrices = {modelMatrix};
            return progInfo.buffersInfo.numIndices;
        },
        draw: (progInfo, worldInfo, gl) => {
            const {
                program,
                attributes: {
                    a_Position, a_Normal, a_Color
                },
                buffersInfo: {
                    vertexBuffer, normalBuffer, colorBuffer, indexBuffer
                }
            } = progInfo;

            // Set program
            gl.useProgram(program);

            // Set attribute buffers
            initAttributeVar(gl, a_Position, vertexBuffer);
            initAttributeVar(gl, a_Normal, normalBuffer);
            initAttributeVar(gl, a_Color, colorBuffer);

            // Bind vertex index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            // Draw cube
            drawCube(progInfo, worldInfo, gl);
        },
        setStaticUniforms: setSharedStaticUniforms
    },
        {
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
                [gl.VERTEX_SHADER, vertShader2],
                [gl.FRAGMENT_SHADER, fragShader2]
            ],
            init: (progInfo, gl) => {
                const modelMatrix = mat4.create();
                mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(2.0, 0.0, 0.0));
                progInfo.buffersInfo = createCubeBuffersInfo(gl);
                progInfo.matrices = {modelMatrix};
                return progInfo.buffersInfo.numIndices;
            },
            draw: (progInfo, worldInfo, gl) => {
                const {
                    program,
                    attributes: {
                        a_Position, a_Normal, a_TexCoord
                    },
                    buffersInfo: {
                        vertexBuffer, normalBuffer, texCoordBuffer, indexBuffer
                    },
                    texture
                } = progInfo;

                // Set program
                gl.useProgram(program);

                // Set attribute buffers
                initAttributeVar(gl, a_Position, vertexBuffer);
                initAttributeVar(gl, a_Normal, normalBuffer);
                initAttributeVar(gl, a_TexCoord, texCoordBuffer);

                // Bind vertex index buffer
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);

                // Draw cube
                drawCube(progInfo, worldInfo, gl);
            },
            setStaticUniforms: (progInfo, _, __, gl) => {
                setSharedStaticUniforms(progInfo, _, __, gl);
                progInfo.texture = loadTexture(gl, textureImg, () => {
                    gl.useProgram(progInfo.program);
                    gl.uniform1i(progInfo.uniforms.u_Sampler, 0);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                });
            }
        }
    ]

;

export default class ProgramObject extends GenericCanvasExperimentView {
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
            fogDist = new Float32Array([10, 15]),
            fogColorWith4th = new Float32Array( Array.from(fogColor).concat([1.0]) ),
            eye = vec3.fromValues(0,  0,  13),  //  x   y   z - Get converted to floating point
            eyeF32 = new Float32Array([13, 0, 0, 1.0]),
            currFocal = vec3.fromValues(0,  0,  0),
            upFocal = vec3.fromValues(0,  1,  0),
            lightDirection = vec3.fromValues(0.0, 3.0, 4.0),

            // Projection
            g_viewMatrix =  mat4.create(),
            g_projMatrix =  mat4.create(),
            g_normalMatrix = mat4.create(),
            g_mvpMatrix = mat4.create(),

            // Static values for easy sharing
            staticValues = {fogColor, fogDist, fogColorWith4th, eye, eyeF32, currFocal, upFocal, lightDirection},
            dynamicValues = {g_mvpMatrix, g_normalMatrix, g_viewMatrix, g_projMatrix, g_angle},

            // Create program objects
            programs = programConfigs.map(progInfo => {
                const
                    program =
                        progInfo.program =
                            initProgram(gl, progInfo.getShadersAssocList(gl));

                if (!program) {
                    error('Error while creating and linking program.');
                    return progInfo;
                }

                const numCreatedVertices =
                    progInfo.numCreatedVertices =
                        progInfo.init(progInfo, gl);

                if (numCreatedVertices === -1) {
                    error('Error while creating vertices buffer.');
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
                    progInfo.setStaticUniforms(progInfo, staticValues, dynamicValues, gl);
                }

                return progInfo;
            })
        ;

        vec3.normalize(lightDirection, lightDirection);
        mat4.lookAt(g_viewMatrix, eye, currFocal, upFocal);
        mat4.perspective(g_projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);

        const
            draw = delta => {
                dynamicValues.g_angle =
                    g_angle = (delta * 0.001) % 360.0;

                // Clear then draw
                gl.clearColor.apply(gl, fogColorWith4th);
                gl.enable(gl.DEPTH_TEST);
                gl.enable(gl.POLYGON_OFFSET_FILL);
                gl.polygonOffset(1.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                programs.forEach(progInfo => {
                    if (!progInfo.program) { return; }
                    progInfo.draw(progInfo, dynamicValues, gl);
                });
            }
        ;

        this.canvasElm = canvasElm;
        rafLimiter(draw, 144);
    }

    render () {
        const {props} = this;
        return (
            <div>
                <header>
                    <h3>{props.fileName}</h3>
                </header>
                <canvas width="610" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            </div>
        );
    }

}
