import {range} from "fjl";
import {concatMap, repeat} from "fjl";
import {initBufferNoEnable, initBufferWithData} from "./WebGlUtils-2";

export const createCubeBuffersInfo = gl => {
        const
            vertices = new Float32Array([   // Vertex coordinates
                1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
                1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
                -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
                -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
                1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
            ]),
            indices = new Uint8Array([       // Indices of the vertices
                0, 1, 2, 0, 2, 3,    // front
                4, 5, 6, 4, 6, 7,    // right
                8, 9, 10, 8, 10, 11,    // up
                12, 13, 14, 12, 14, 15,    // left
                16, 17, 18, 16, 18, 19,    // down
                20, 21, 22, 20, 22, 23     // back
            ]),
            normals = new Float32Array([    // Normal
                0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
                0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
                -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
                0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
                0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
            ]),
            faces = new Uint8Array(concatMap(n => repeat(4, parseFloat(n)), range(1, 6))),
            texCoords = new Float32Array([   // Texture coordinates
                1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
                0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
                1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
                1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
                0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
                0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
            ]),
            out = {
                vertexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, vertices),
                normalBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, normals),
                texCoordBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, texCoords),
                indexBuffer: initBufferNoEnable(gl, gl.FLOAT, 3, indices),
                facesBuffer: initBufferNoEnable(gl, gl.UNSIGNED_BYTE, 1, faces),
            }
        ;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return out;
}
;
