import React from 'react';
import OrbitingTriangle from './OrbitingTriangle';
import RotatedTranslatedTriangle from './RotatedTranslatedTriangle';
import RotatingTriangle from './RotatingTriangle';
import RotatingTriangleWithButtons from './RotatingTriangleWithButtons';
export default function Chapter4 () {
    return (
        <div className="chapter">
            <div className="canvas-experiment">
                <RotatedTranslatedTriangle />
            </div>
            <div className="canvas-experiment">
                <RotatingTriangle />
            </div>
            <div className="canvas-experiment">
                <OrbitingTriangle />
            </div>
            <div className="canvas-experiment">
                <RotatingTriangleWithButtons />
            </div>
        </div>
    );
}
