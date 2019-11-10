import React from 'react';
import {error} from '../../utils/utils';
import {
    getWebGlContext, initProgram, toAttribLoc as attribLoc, toUniformLoc as uniformLoc,
    toRadians, initBufferWithData
} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';
import {range} from 'fjl';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

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

export default class MultiJointModel extends GenericCanvasExperimentView {
    static defaultProps = {
        aliasName: 'experiment-alias-name',
        canvasId: 'experiment-canvas',
        fileName: 'FileNameGoesHere.jsx'
    };

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
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
                <p>←→: arm1 rotation,↑↓: joint1 rotation, xz: joint2(wrist) rotation, cv: finger rotation</p>
            </div>
        );
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

        function initVertexBuffers () {
            const vertices = new Float32Array([
                    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
                    0.5, 1.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 1.0, -0.5, // v0-v3-v4-v5 right
                    0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
                    -0.5, 1.0, 0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
                    -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
                    0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5, 0.5, 1.0, -0.5  // v4-v7-v6-v5 back
                ]),
                normals = new Float32Array([
                    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
                    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
                    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
                    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
                    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
                    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
                ]),
                indices = new Uint8Array([
                    0, 1, 2, 0, 2, 3,    // front
                    4, 5, 6, 4, 6, 7,    // right
                    8, 9, 10, 8, 10, 11,    // up
                    12, 13, 14, 12, 14, 15,    // left
                    16, 17, 18, 16, 18, 19,    // down
                    20, 21, 22, 20, 22, 23     // back
                ]),
                colors = new Float32Array(
                    [].concat.apply(
                        [], range(0, vertices.length / 3)
                            .map(() => [1.0, 0.0, 0.0])
                    )
                ),
                indexBuffer = gl.createBuffer()
            ;

            if (
                !initBufferWithData(gl, gl.ARRAY_BUFFER, 3, gl.FLOAT, 'a_Position', vertices) ||
                !initBufferWithData(gl, gl.ARRAY_BUFFER, 3, gl.FLOAT, 'a_Color', colors) ||
                !initBufferWithData(gl, gl.ARRAY_BUFFER, 3, gl.FLOAT, 'a_Normal', normals)) {
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

        let
            g_arm1Angle = 90.0,
            g_joint1Angle = 45.0,
            g_joint2Angle = 0.0,
            g_joint3Angle = 0.0,
            angleStep = 21.0;

        const

            baseHeight = 2.0,
            armLength = 10.0,
            arm2Length = 10.0,
            palmLength = 2.0,

            eye =       vec3.fromValues(20.0,  10.0,  30.0),  // Get converted to floating point
            currFocal = vec3.fromValues(0,  0,  0),
            upFocal =   vec3.fromValues(0,  1,  0),
            u_MvpMatrix =   uniformLoc(gl, 'u_MvpMatrix'),
            u_NormalMatrix= uniformLoc(gl, 'u_NormalMatrix'),
            u_ModelMatrix=  uniformLoc(gl, 'u_ModelMatrix'),
            u_LightColor =  uniformLoc(gl, 'u_LightColor'),
            u_LightDirection = uniformLoc(gl, 'u_LightDirection'),
            u_LightPosition =  uniformLoc(gl, 'u_LightPosition'),
            u_AmbientLight =   uniformLoc(gl, 'u_AmbientLight'),
            viewMatrix =    mat4.create(),
            projMatrix =    mat4.create(),
            mvpMatrix =     mat4.create(),
            normalMatrix =  mat4.create(),
            lightDirection = vec3.fromValues(0.0, 3.0, 4.0),

            onKeyDown = e => {
                if (e.key.indexOf('Arrow') === 0) {
                    e.preventDefault();
                }
                switch (e.key.toLowerCase()) {
                    case 'arrowup':
                        if (g_joint1Angle < 135.0) {
                            g_joint1Angle += angleStep;
                        }
                        break;
                    case 'arrowdown':
                        if (g_joint1Angle > -135.0) {
                            g_joint1Angle -= angleStep;
                        }
                        break;
                    case 'arrowleft':
                        g_arm1Angle = (g_arm1Angle - angleStep) % 360.0;
                        break;
                    case 'arrowright':
                        g_arm1Angle = (g_arm1Angle + angleStep) % 360.0;
                        break;
                    case 'z':
                        g_joint2Angle = (g_joint2Angle + angleStep) % 360;
                        break;
                    case 'x':
                        g_joint2Angle = (g_joint2Angle - angleStep) % 360;
                        break;
                    case 'v':
                        if (g_joint3Angle < 60.0)  g_joint3Angle = (g_joint3Angle + angleStep) % 360;
                        break;
                    case 'c':
                        if (g_joint3Angle > -60.0) g_joint3Angle = (g_joint3Angle - angleStep) % 360;
                        break;
                    default:
                        return;
                }
                draw(mat4.create());
            },

            drawBox = modelMatrix => {

                // Magic Matrix: Inverse transpose matrix (for affecting normals on
                //  shape when translating, scaling etc.)
                mat4.copy(normalMatrix, modelMatrix);
                mat4.invert(normalMatrix, normalMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                mat4.multiply(mvpMatrix, projMatrix, viewMatrix);
                mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

                gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
                gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);
                gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

                gl.drawElements(gl.TRIANGLES, numCreatedVertices, gl.UNSIGNED_BYTE, 0);
            },

            draw = modelMatrix => {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                let scaled, last;

                // Base
                last = mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0.0, -12.0, 0.0));
                scaled = mat4.scale(mat4.create(), last, vec3.fromValues(10.0, baseHeight, 10.0));
                drawBox(scaled);

                // Arm 1
                mat4.translate(last, last, vec3.fromValues(0.0,  baseHeight , 0.0));
                mat4.rotateY(last, last, toRadians(g_arm1Angle));
                scaled = mat4.scale(mat4.create(), last, vec3.fromValues(3.0, armLength, 3.0));
                drawBox(scaled);

                // Arm 2
                mat4.translate(last, last, vec3.fromValues(0.0, armLength, 0.0));
                mat4.rotateZ(last, last, toRadians(g_joint1Angle));
                scaled = mat4.scale(mat4.create(), last, vec3.fromValues(4.0, arm2Length, 4.0));
                drawBox(scaled);

                // Palm length
                mat4.translate(last, last, vec3.fromValues(0.0, arm2Length, 0.0));
                mat4.rotateY(last, last, toRadians(g_joint2Angle));
                scaled = mat4.scale(mat4.create(), last, vec3.fromValues(2.0, palmLength, 6.0));
                drawBox(scaled);

                // Move to palm tip center
                mat4.translate(last, last, vec3.fromValues(0.0, palmLength, 0.0));

                // Finger 1
                const finger1Matrix = mat4.clone(last);
                mat4.translate(finger1Matrix, finger1Matrix, vec3.fromValues(0.0, 0.0, 2.0));
                mat4.rotateX(finger1Matrix, finger1Matrix, toRadians(g_joint3Angle));
                mat4.scale(finger1Matrix, finger1Matrix, vec3.fromValues(1.0, 2.0, 1.0));
                drawBox(finger1Matrix);

                // Finger 2
                mat4.translate(last, last, vec3.fromValues(0.0, 0.0, -2.0));
                mat4.rotateX(last, last, toRadians(g_joint3Angle));
                scaled = mat4.scale(last, last, vec3.fromValues(1.0, 2.0, 1.0));
                drawBox(scaled);
            },

            init = () => {
                this.onKeyDown = onKeyDown;
                window.addEventListener('keydown', this.onKeyDown);

                vec3.normalize(lightDirection, lightDirection);
                mat4.copy(mvpMatrix, viewMatrix);
                mat4.perspective(projMatrix, toRadians(50), canvasElm.offsetWidth / canvasElm.offsetHeight, 1.0, 100.0);
                mat4.lookAt(viewMatrix, eye, currFocal, upFocal);

                gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
                gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
                gl.uniform3f(u_LightPosition, 13.0, 21.0, 21.0);
                gl.uniform3fv(u_LightDirection, lightDirection);

                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.enable(gl.POLYGON_OFFSET_FILL);
                gl.polygonOffset(1.0, 1.0);

                draw(mat4.create());
            }
        ;

        init();
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.onKeyDown);
    }

}
