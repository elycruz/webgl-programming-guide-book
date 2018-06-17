import React from 'react';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram, getAttribLoc as attribLoc, getUniformLoc as uniformLoc,
    toRadians
} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import {range$} from 'fjl-range';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    vertShader = `
        precision highp float;
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform vec3 u_LightColor;
        uniform vec3 u_LightDirection;
        uniform vec3 u_AmbientLight;
        varying vec4 v_Color;
        void main () {
            gl_Position = u_MvpMatrix * a_Position;
            
            // Make length of normal '1.0'
            vec3 normal = normalize(vec3(a_Normal.xyz));

            // Calculate the color due to ambient reflection
            vec3 ambient = u_AmbientLight * a_Color.rgb;
            
            // Dot product of light direction and orientation of a surface
            float nDotL = max(dot(u_LightDirection, normal), 0.0);
            
            // Calculate color due to diffuse reflection
            vec3 diffuse = u_LightColor * vec3(a_Color.rgb) * nDotL;
            
            v_Color = vec4(diffuse + ambient, a_Color.a);
        }`,

    fragShader = `
        precision highp float;
        varying vec4 v_Color;
        void main () {
            gl_FragColor = v_Color;
        }`

;

export default class LightedCube_ambient extends GenericCanvasExperimentView {
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
                        [], range$(0, vertices.length / 3)
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
                                //  x   y   z
        const eye =       vec3.fromValues(3,  3,  7),  // Get converted to floating point
            currFocal =   vec3.fromValues(0,  0,  0),
            upFocal =     vec3.fromValues(0,  1,  0),
            u_MvpMatrix = uniformLoc(gl, 'u_MvpMatrix'),
            u_LightColor = uniformLoc(gl, 'u_LightColor'),
            u_LightDirection = uniformLoc(gl, 'u_LightDirection'),
            u_AmbientLight = uniformLoc(gl, 'u_AmbientLight'),
            viewMatrix =  mat4.create(),
            projMatrix =  mat4.create(),
            modelMatrix = mat4.create(),
            mvpMatrix =   mat4.create(),
            // lightColor = vec3.fromValues(1.0, 1.0, 1.0),
            lightDirection = vec3.fromValues(0.5, 3.0, 4.0)
        ;

        vec3.normalize(lightDirection, lightDirection);
        mat4.lookAt(viewMatrix, eye, currFocal, upFocal);
        // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.75, 0.0, 0.0));
        mat4.perspective(projMatrix, toRadians(30), canvasElm.offsetWidth / canvasElm.offsetHeight, 1, 100);
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
        gl.uniform3fv(u_LightDirection, lightDirection);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);

        // Clear then draw
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, numCreatedVertices, gl.UNSIGNED_BYTE, 0);
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
