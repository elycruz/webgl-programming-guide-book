import React from 'react';
import DrawAPoint from './DrawAPoint';
import DrawAPoint2 from './DrawAPoint2';
import DrawAPoint3 from './DrawAPoint3';
import DrawRectangle from './DrawRectangle';

export default function Chapter2 (props) {
    return (
        <React.Fragment>
            <DrawRectangle/>
            <DrawAPoint/>
            <DrawAPoint2/>
            <DrawAPoint3/>
        </React.Fragment>
    );
}
