import React from 'react';
import MultiAttributeSize from './MultiAttributeSize';
import MultiAttributeSize_Interleaved from './MultiAttributeSize_Interleaved';
import MultiAttributeColor from './MultiAttributeColor';
import ColoredTriangle from './ColoredTriangle';
import HelloTriangle_FragCoord from './HelloTriangle_FragCoord';
import TextureQuad from './TextureQuad';
import TextureQuad_Repeat from './TextureQuad_Repeat';
import TextureQuad_Clamp_Mirror from './TextureQuad_Clamp_Mirror';
import MultiTexture from './MultiTexture';

export default function Chapter5 () {
    return(
        <div className="chapter">
            <div className="canvas-experiment">
                <MultiAttributeSize />
            </div>
            <div className="canvas-experiment">
                <MultiAttributeSize_Interleaved />
            </div>
            <div className="canvas-experiment">
                <MultiAttributeColor />
            </div>
            <div className="canvas-experiment">
                <ColoredTriangle />
            </div>
            <div className="canvas-experiment">
                <HelloTriangle_FragCoord />
            </div>
            <div className="canvas-experiment">
                <TextureQuad />
            </div>
            <div className="canvas-experiment">
                <TextureQuad_Repeat />
            </div>
            <div className="canvas-experiment">
                <TextureQuad_Clamp_Mirror />
            </div>
            <div className="canvas-experiment">
                <MultiTexture />
            </div>
        </div>
    )
}