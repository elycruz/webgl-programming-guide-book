import {error} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    vertextShader = `
        attribute vec4 a_Position;
        void main () {
            gl_Position = a_Position;
            gl_PointSize = 20.0;
        }`,

    fragmentShader = `
        precision mediump float;
        uniform vec4 u_FragColor;
        void main () {
            gl_FragColor = u_FragColor;
        }
        `
;

export default class DrawAPoint2 extends GenericCanvasExperimentView {
    static defaultProps = {
        canvasId: 'draw-a-point-2-canvas',
        mouseClickName: 'click'
    };

    constructor (props) {
        super(props);
        this.onCanvasClick = () => undefined;
    }

    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = WebGlUtils.getWebGlContext(canvasElm);

        if (!WebGlUtils.initShaders (gl, vertextShader, fragmentShader)) {
            error('Unable to initialize shaders.');
        }

        let a_Position = gl.getAttribLocation(gl.program, 'a_Position'),
            u_FragColor= gl.getUniformLocation(gl.program, 'u_FragColor'),
            g_colors = [],
            g_points = [],
            SW = canvasElm.width,
            SH = canvasElm.height;

        function paintAtMouseEvent (e) {
            let ex = e.clientX,
                ey = e.clientY,
                rect = e.target.getBoundingClientRect(),
                x = ((ex - rect.left) - SW / 2) / (SW / 2),
                y = (SH / 2 - (ey - rect.top)) / (SH / 2),
                rgba,
                pos,
                len;

            g_points.push([x, y]);
            g_colors.push([1.0, 0.0, 0.0, 1.0]);

            gl.clear(gl.COLOR_BUFFER_BIT);
            len = g_points.length;

            for (let i = 0; i < len; i += 1) {
                rgba = g_colors[i];
                pos = g_points[i];
                gl.vertexAttrib3f(a_Position, pos[0], pos[1], 0.0);
                gl.uniform4f.apply(gl, [u_FragColor].concat(rgba));
                gl.drawArrays(gl.POINTS, 0, 1);
            }
            canvasElm.blur();
        }

        this.onCanvasClick = paintAtMouseEvent.bind(this);

        canvasElm.addEventListener(this.props.mouseClickName, this.onCanvasClick);

        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
        gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 0.0);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    componentWillUnmount () {
        this.canvas.current.removeEventListener(
            this.props.mouseClickName, this.onCanvasClick);
    }

}
