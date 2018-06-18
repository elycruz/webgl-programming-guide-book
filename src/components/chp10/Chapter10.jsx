import React from 'react';
import RotateObject from './RotateObject';
import PickObject from './PickObject';
import PickFace from './PickFace';
import HUD from './HUD';
import ThreeDOver from './ThreeDOver';
import Fog from './Fog';
import FogW from './FogW';
import RoundedPoints from "./RoundedPoints";
import LookAtBlendedTriangles from "./LookAtBlendedTriangles";
import BlendedCube from "./BlendedCube";

const Chapter10 = () => (
        <div className="chapter">
            <div className="canvas-experiment">
                <RotateObject/>
            </div>
            <div className="canvas-experiment">
                <PickObject/>
            </div>
            <div className="canvas-experiment">
                <PickFace/>
            </div>
            <div className="canvas-experiment">
                <HUD />
            </div>
            <div className="canvas-experiment">
                <ThreeDOver />
            </div>
            <div className="canvas-experiment">
                <Fog />
            </div>
            <div className="canvas-experiment">
                <FogW />
            </div>
            <div className="canvas-experiment">
                <RoundedPoints />
            </div>
            <div className="canvas-experiment">
                <LookAtBlendedTriangles />
            </div>
            <div className="canvas-experiment">
                <BlendedCube />
            </div>
        </div>
    )
;

export default Chapter10;
