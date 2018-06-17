import React from 'react';
import JointModel from "./JointModel";
import MultiJointModel from "./MultiJointModel";
import MultiJointModel_segment from "./MultiJointModel_segment";

export default function () {
    return (
        <div className="chapter">
            <div className="canvas-experiment">
                <JointModel />
            </div>
            <div className="canvas-experiment">
                <MultiJointModel />
            </div>
            <div className="canvas-experiment">
                <MultiJointModel_segment />
            </div>
        </div>
    )
}
