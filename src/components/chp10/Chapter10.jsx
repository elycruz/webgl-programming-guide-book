import React from 'react';
import RotateObject from './RotateObject';
import PickObject from './PickObject';
import PickFace from './PickFace';

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
        </React.Fragment>
    )
;

export default Chapter10;
