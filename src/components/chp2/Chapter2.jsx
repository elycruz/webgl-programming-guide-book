import React from 'react';
import DrawAPoint from './DrawAPoint';
import DrawAPoint2 from './DrawAPoint2';
import DrawAPoint3 from './DrawAPoint3';
import DrawRectangle from './DrawRectangle';

export default function Chapter2 () {
    return (
        <div className="chapter">
            <div className="canvas-experiment">
                <DrawRectangle/>
            </div>
            <div className="canvas-experiment">
                <DrawAPoint/>
            </div>
            <div className="canvas-experiment">
                <DrawAPoint2/>
            </div>
            <div className="canvas-experiment">
                <DrawAPoint3/>
            </div>
        </div>
    );
}
