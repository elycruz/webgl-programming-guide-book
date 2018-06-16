import React from 'react';
import RotateObject from './RotateObject';
import PickObject from './PickObject';
import PickFace from './PickFace';
import HUD from './HUD';
import ThreeDOver from './ThreeDOver';

const Chapter10 = () => (
        <React.Fragment>
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
        </React.Fragment>
    )
;

export default Chapter10;