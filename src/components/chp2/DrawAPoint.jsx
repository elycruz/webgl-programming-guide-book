import {error} from '../../utils/utils';
import * as WebGlUtils from '../../utils/WebGlUtils';
import GenericCanvasExperimentView from "../app/GenericCanvasExperimentView";

const

    vertextShader = `
        void main () {
            gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
            gl_PointSize = 10.0;
        }`,

    fragmentShader = `
        void main () {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`
;

export default class DrawAPoint extends GenericCanvasExperimentView {
    componentDidMount () {
        const canvasElm = this.canvas.current,
            gl = WebGlUtils.getWebGlContext(canvasElm);

        // gl.fillStyle = 'rgba(0,0,255,1.0)';
        // gl.fillRect(120, 10, 150, 150);

        if (!WebGlUtils.initShaders (gl, vertextShader, fragmentShader)) {
            error('Unable to initialize shaders');
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);

        // ctx.drawColor(1.0,0.0,0.0,1.0);
        // ctx.drawPoint(0,0,0,10);
    }

}
