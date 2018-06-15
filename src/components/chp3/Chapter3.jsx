import React from 'react';
import HelloQuad from './HelloQuad';
import HelloTriangle from './HelloTriangle';
import MultiPoint from './MultiPoint';
import RotatedTriangle from './RotatedTriangle';
import RotatedTriangle_Matrix from './RotatedTriangle_Matrix';
import ScaledTriangle_Matrix from './ScaledTriangle_Matrix';
import TranslatedTriangle from './TranslatedTriangle';
import TranslatedTriangle_Matrix from './TranslatedTriangle_Matrix';

export default function Chapter2(props) {
    return (
        <React.Fragment>
            <div className="canvas-experiment">
                <HelloQuad/>
            </div>
            <div className="canvas-experiment">
                <HelloTriangle/>
            </div>
            <div className="canvas-experiment">
                <MultiPoint/>
            </div>
            <div className="canvas-experiment">
                <RotatedTriangle/>
            </div>
            <div className="canvas-experiment">
                <RotatedTriangle_Matrix/>
            </div>
            <div className="canvas-experiment">
                <ScaledTriangle_Matrix/>
            </div>
            <div className="canvas-experiment">
                <TranslatedTriangle/>
            </div>
            <div className="canvas-experiment">
                <TranslatedTriangle_Matrix/>
            </div>
        </React.Fragment>
    );
}
