import React from 'react';
import LookAtTriangles from "./LookAtTriangles";
import LookAtRotatedTriangles from "./LookAtRotatedTriangles";
import LookAtRotatedTriangles_mvMatrix from "./LookAtRotatedTriangles_mvMatrix";
import LookAtRotatedTrianglesWithKeys from "./LookAtRotatedTrianglesWithKeys";
import LookAtRotatedTrianglesWithKeys_ViewVolume from "./LookAtRotatedTrianglesWithKeys_ViewVolume";
import OrthoView from "./OrthoView";
import PerspectiveView from "./PerspectiveView";
import PerspectiveView_mvp from "./PerspectiveView_mvp";
import PerspectiveView_mvpMatrix from "./PerspectiveView_mvpMatrix";
import DepthBuffer from "./DepthBuffer";
import ZFighting from "./ZFighting";
import HelloCube from "./HelloCube";
import ColoredCube from "./ColoredCube";
import ColoredCube_singleColor from "./ColoredCube_singleColor";

export default function () {
    return (
        <div className="chapter">
            <div className="canvas-experiment">
                <LookAtTriangles />
            </div>
            <div className="canvas-experiment">
                <LookAtRotatedTriangles />
            </div>
            <div className="canvas-experiment">
                <LookAtRotatedTriangles_mvMatrix />
            </div>
            <div className="canvas-experiment">
                <LookAtRotatedTrianglesWithKeys />
            </div>
            <div className="canvas-experiment">
                <LookAtRotatedTrianglesWithKeys_ViewVolume />
            </div>
            <div className="canvas-experiment">
                <OrthoView />
            </div>
            <div className="canvas-experiment">
                <PerspectiveView />
            </div>
            <div className="canvas-experiment">
                <PerspectiveView_mvp />
            </div>
            <div className="canvas-experiment">
                <PerspectiveView_mvpMatrix />
            </div>
            <div className="canvas-experiment">
                <DepthBuffer />
            </div>
            <div className="canvas-experiment">
                <ZFighting />
            </div>
            <div className="canvas-experiment">
                <HelloCube />
            </div>
            <div className="canvas-experiment">
                <ColoredCube />
            </div>
            <div className="canvas-experiment">
                <ColoredCube_singleColor />
            </div>
        </div>
    )
}
