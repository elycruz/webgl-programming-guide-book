import React from 'react';
import LightedCube from './LightedCube';
import LightedCube_ambient from './LightedCube_ambient';
import LightedTranslatedRotatedCube from './LightedTranslatedRotatedCube';
import PointLightedCube from './PointLightedCube';
import PointLightedCubeAnimated from './PointLightedCubeAnimated';
import PointLightedCube_perFragment from './PointLightedCube_perFragment';

export default function Chapter8 () {
    return (
        <div className="chapter">
            <div className="canvas-experiment">
                <LightedCube />
            </div>
            <div className="canvas-experiment">
                <LightedCube_ambient />
            </div>
            <div className="canvas-experiment">
                <LightedTranslatedRotatedCube />
            </div>
            <div className="canvas-experiment">
                <PointLightedCube />
            </div>
            <div className="canvas-experiment">
                <PointLightedCubeAnimated />
            </div>
            <div className="canvas-experiment">
                <PointLightedCube_perFragment />
            </div>
        </div>
    )
}