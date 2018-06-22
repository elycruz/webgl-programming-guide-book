/**
 * Vertex Shader
 */
const vertexShader = `
    precision highp float;
    
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_Normal;
    
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ModelMatrix;
    uniform vec4 u_Eye;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying vec2 v_TexCoord;
    varying float v_Dist;
    
    void main () {
        gl_Position = u_MvpMatrix * a_Position;
    
        v_TexCoord = a_TexCoord;
    
        // Calculate the world coordinate of the vertex
        v_Position = vec3(u_ModelMatrix * a_Position);
    
        // Recalculate normal with normal matrix and make length of normal '1.0'
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    
        // Calculate distance for given vertex from eye
        // Using distance approximation using 'z' value of vertex
        v_Dist = gl_Position.w; //  distance(u_ModelMatrix * a_Position, u_Eye);
    }
`;

export default vertexShader;
