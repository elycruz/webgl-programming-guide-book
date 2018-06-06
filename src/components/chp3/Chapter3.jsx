import React from 'react';
import HelloQuad from './HelloQuad';
import HelloTriangle from './HelloTriangle';
import MultiPoint from './MultiPoint';
import RotatedTriangle from './RotatedTriangle';
import RotatedTriangle_Matrix from './RotatedTriangle_Matrix';
import ScaledTriangle_Matrix from './ScaledTriangle_Matrix';
import TranslatedTriangle from './TranslatedTriangle';
import TranslatedTriangle_Matrix from './TranslatedTriangle_Matrix';

export default function Chapter2 (props) {
    return (
        <React.Fragment>
            <HelloQuad/>
            <HelloTriangle/>
            <MultiPoint/>
            <RotatedTriangle/>
            <RotatedTriangle_Matrix/>
            <ScaledTriangle_Matrix/>
            <TranslatedTriangle/>
            <TranslatedTriangle_Matrix/>
        </React.Fragment>
    );
}
