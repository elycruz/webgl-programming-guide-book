import React, {Component} from 'react';
import GenericCanvasExperimentView from '../app/GenericCanvasExperimentView';
import {uuid, error} from '../../utils/utils';
import {getWebGlContext, initProgram, toRadians} from "../../utils/WebGlUtils-2";
import {mat4, vec3} from 'gl-matrix';

const ListF32 = from => new Float32Array(from);

const

    fragShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
        }`,

    vertShader = `
        attribute vec4 a_Position;
        uniform mat4 u_TransformMatrix;
        void main () {
            gl_Position = u_TransformMatrix * a_Position;
        }`

;

export default class RotatingTriangleWithButtons extends Component {
    static defaultProps = {
        aliasName: 'experiment-alias-name',
        canvasId: 'experiment-canvas',
        fileName: 'FileNameGoesHere.jsx',
        angleStep: 45.0
    };

    static onAngleStepChange (e) {
        this.angleStep = parseFloat(e.currentTarget.value);
        this.angleStepVisualRef.current.innerHTML = this.angleStep;
    }

    constructor (props) {
        super(props);
        this.canvas = React.createRef();
        this.angleStepVisualRef = React.createRef();
        this.angleStep = this.props.angleStep;
    }

    componentWillMount () {
        this.boundAngleStepChange = RotatingTriangleWithButtons.onAngleStepChange.bind(this);
    }

    componentDidMount () {
        const self = this,
            canvasElm = this.canvas.current,
            gl = getWebGlContext(canvasElm),
            shadersAssocList = [
                [gl.VERTEX_SHADER, vertShader],
                [gl.FRAGMENT_SHADER, fragShader]
            ],
            program = initProgram(gl, shadersAssocList),
            triangleModelMatrix = mat4.create();

        let g_last,
            currentAngle = 0.0
        ;

        if (!program) {
            error('Error while creating and linking program.');
            return;
        }

        const u_TransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrix');

        function initVertexBuffers (glContext) {
            const vertices = new Float32Array([
                    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
                ]),
                vertexBuffer = glContext.createBuffer(),
                _a_Position_ = gl.getAttribLocation(gl.program, 'a_Position');
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(_a_Position_, 2, gl.FLOAT,  false, 0, 0);
            gl.enableVertexAttribArray(_a_Position_);
            return !vertexBuffer ? -1 : 3; // num sides in shape
        }

        function getTick (modelMatrix) {
            return function tick () {
                currentAngle = animate(currentAngle);
                draw(currentAngle, modelMatrix, u_TransformMatrix);
                requestAnimationFrame(tick);
            }
        }

        function draw (currentAngle, modelMatrix, u_TransformMatrix) {
            // Create vertices for shape
            const numCreatedVertices = initVertexBuffers(gl);

            if (numCreatedVertices === -1) {
                error('Error while creating vertice buffer.');
                // return;
            }

            const radians = toRadians(currentAngle),
                out = mat4.create(),
                cosB = Math.cos(radians),
                sinB = Math.sin(radians)
            ;

            // mat4.scale(out, out, ListF32([cosB, sinB, 1]));
            mat4.translate(out, modelMatrix, ListF32([cosB, sinB, 1]));
            mat4.rotateZ(out, out, radians);

            // Pass rotation values
            gl.uniformMatrix4fv(u_TransformMatrix, false, out);

            // Clear then draw
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, numCreatedVertices);
        }

        function animate (angle) {
            let now = Date.now(),
                elapsed = now - g_last,
                newAngle;
            g_last = now;
            newAngle = (angle + (self.angleStep * elapsed) / 1000.0);
            return newAngle % 360;
        }

        // Mark time for timings calc
        g_last = Date.now();

        // Scale transform-matrix
        mat4.scale(triangleModelMatrix, triangleModelMatrix, ListF32([0.55, 0.55, 1]));

        // Start animation
        getTick(triangleModelMatrix)();
    }

    render () {
        const {props} = this;

        return ([
                <header key={uuid(props.aliasName + '-element-')}>
                    <h3>{props.fileName}</h3>
                </header>,
                <section key={uuid(props.aliasName + '-element-')}>
                    <canvas width="377" height="377"
                            id={props.canvasId} ref={this.canvas}>
                        <p>Html canvas element not supported</p>
                    </canvas>
                </section>,
                <section key={uuid(props.aliasName + '-element-')}>
                    <div className="form-field block visual-slider">
                        <span>Angle step (speed):</span>
                        <div className="slider">
                            <span>-</span>
                            <input onChange={this.boundAngleStepChange} type="range" step="5" min="5" max="360" defaultValue="5" />
                            <span>+</span>
                            <span>=</span>
                            <span ref={this.angleStepVisualRef}>{this.angleStep}</span>
                        </div>
                    </div>
                </section>
            ]
        );
    }


}
