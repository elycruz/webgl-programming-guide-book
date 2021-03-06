import React from 'react';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram, toAttribLoc as attribLoc, toUniformLoc as uniformLoc,
    toRadians
} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import {range} from 'fjl';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";
import rafLimiter from "../../utils/raqLimiter";

const

    vertShader = `
        precision highp float;
        
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_NormalMatrix;
        uniform mat4 u_ModelMatrix;
        
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying vec4 v_Color;
        
        void main () {
            gl_Position = u_MvpMatrix * a_Position;
            v_Color = a_Color; 
            
            // Calculate the world coordinate of the vertex
            v_Position = vec3(u_ModelMatrix * a_Position);
            
            // Recalculate normal with normal matrix and make length of normal '1.0'
            v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        }`,

    fragShader = `
        precision highp float;
        
        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        uniform vec3 u_LightPosition;
        uniform vec3 u_AmbientLight;
        
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying vec4 v_Color;
        
        void main () {
            // Calculate light direction and make it 1.0 in length
            vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));

            // Calculate the color due to ambient reflection
            vec3 ambient = u_AmbientLight * v_Color.rgb;
            
            // Dot product of light direction and orientation of a surface
            float nDotL = max(dot(lightDirection, v_Normal), 0.0);
            
            // Calculate color due to diffuse reflection
            vec3 diffuse = u_LightColor * vec3(v_Color.rgb) * nDotL;
            
            // Calculate color
            gl_FragColor = vec4(diffuse + ambient, v_Color.a);
        }`

;

export default class PointLightedCube_perFragment extends GenericCanvasExperimentView {
    static defaultProps = {
        aliasName: 'experiment-alias-name',
        canvasId: 'experiment-canvas',
        fileName: 'FileNameGoesHere.jsx'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertShader],
                [gl.FRAGMENT_SHADER, fragShader]
            ],
            program = initProgram(gl, shadersAssocList);

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        function initBufferWithData (bufferType, numParts, attribType, attribName, bufferData) {
            const buffer = gl.createBuffer(),
                a_Attrib = attribLoc(gl, attribName);
            gl.bindBuffer(bufferType, buffer);
            gl.bufferData(bufferType, bufferData, gl.STATIC_DRAW);
            gl.vertexAttribPointer(a_Attrib, numParts, attribType || gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(a_Attrib);
            return !!buffer;
        }

        function initVertexBuffers () {
            const
                vertices = new Float32Array([   // Vertex coordinates
                    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
                    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
                    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
                    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
                    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
                    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
                ]),
                colors = new Float32Array(
                    [].concat.apply(
                        [], range(0, vertices.length / 3)
                            .map(() => [1.0, 0.0, 0.0])
                    )
                ),
                indices = new Uint8Array([       // Indices of the vertices
                    0, 1, 2,   0, 2, 3,    // front
                    4, 5, 6,   4, 6, 7,    // right
                    8, 9,10,   8,10,11,    // up
                    12,13,14,  12,14,15,    // left
                    16,17,18,  16,18,19,    // down
                    20,21,22,  20,22,23     // back
                ]),
                normals = new Float32Array([    // Normal
                    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
                    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
                    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
                    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
                    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
                    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
                ]),
                indexBuffer = gl.createBuffer()
            ;

            if (
                !initBufferWithData(gl.ARRAY_BUFFER, 3, gl.FLOAT, 'a_Position', vertices) ||
                !initBufferWithData(gl.ARRAY_BUFFER, 3, gl.FLOAT, 'a_Color', colors) ||
                !initBufferWithData(gl.ARRAY_BUFFER, 3, gl.FLOAT, 'a_Normal', normals)) {
                    return -1;
                }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            return !indexBuffer ? -1 : indices.length; // num sides in shape
        }

        const numCreatedVertices = initVertexBuffers(gl);

        if (numCreatedVertices === -1) {
            error('Error while creating vertices buffer.');
        }

        let angle = 0;
                                      //  x   y   z
        const eye =       vec3.fromValues(3,  3,  7),  // Get converted to floating point
            currFocal =   vec3.fromValues(0,  0,  0),
            upFocal =     vec3.fromValues(0,  1,  0),
            u_MvpMatrix = uniformLoc(gl, 'u_MvpMatrix'),
            u_NormalMatrix= uniformLoc(gl, 'u_NormalMatrix'),
            u_ModelMatrix= uniformLoc(gl, 'u_ModelMatrix'),
            u_LightColor = uniformLoc(gl, 'u_LightColor'),
            u_LightDirection = uniformLoc(gl, 'u_LightDirection'),
            u_LightPosition = uniformLoc(gl, 'u_LightPosition'),
            u_AmbientLight = uniformLoc(gl, 'u_AmbientLight'),
            viewMatrix =  mat4.create(),
            projMatrix =  mat4.create(),
            modelMatrix = mat4.create(),
            mvpMatrix =   mat4.create(),
            normalMatrix = mat4.create(),
            lightDirection = vec3.fromValues(0.0, 3.0, 4.0);

        vec3.normalize(lightDirection, lightDirection);
        mat4.lookAt(viewMatrix, eye, currFocal, upFocal);

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
        gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);
        gl.uniform3fv(u_LightDirection, lightDirection);

        const draw = delta => {
                angle = (delta * 0.001) % 360.0;
                mat4.rotateY(modelMatrix, modelMatrix, angle);

                // Magic Matrix: Inverse transpose matrix (for affecting normals on
                //  shape when translating, scaling etc.)
                mat4.copy(normalMatrix, modelMatrix);
                mat4.invert(normalMatrix, normalMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                mat4.perspective(projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);
                mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
                mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

                gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
                gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);
                gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

                // Clear then draw
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.enable(gl.POLYGON_OFFSET_FILL);
                gl.polygonOffset(1.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.drawElements(gl.TRIANGLES, numCreatedVertices, gl.UNSIGNED_BYTE, 0);
            }
        ;

        rafLimiter(draw, 144);
    }

    render () {
        const {props} = this;
        return (
            <div>
                <header>
                    <h3>{props.fileName}</h3>
                </header>
                <canvas width="377" height="377"
                        id={props.canvasId} ref={this.canvas}>
                    <p>Html canvas element not supported</p>
                </canvas>
            </div>
        );
    }

}
