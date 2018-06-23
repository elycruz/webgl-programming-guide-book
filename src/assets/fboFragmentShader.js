/**
 * Fragment shader
 */
const fragShader = `
precision highp float;
    
    uniform sampler2D u_Sampler;
    
    varying vec2 v_TexCoord;
    varying float v_NdotL;

    uniform vec3 u_LightColor;
    uniform vec3 u_LightDirection;
    uniform vec3 u_LightPosition;
    uniform vec3 u_AmbientLight;
    uniform vec3 u_FogColor;
    uniform vec2 u_FogDist;
    
    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying float v_Dist;
    
    void main() {
        float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);
        vec4 v_Color = texture2D(u_Sampler, v_TexCoord);
    
        // Calculate light direction and make it 1.0 in length
        vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));

        // Calculate the color due to ambient reflection
        vec3 ambient = u_AmbientLight * v_Color.rgb;
        
        // Dot product of light direction and orientation of a surface
        float nDotL = max(dot(lightDirection, v_Normal), 0.0);
        
        // Calculate color due to diffuse reflection
        vec3 diffuse = u_LightColor * vec3(v_Color.rgb) * nDotL;
        
        // Calculate color
        // u_FogColor * (1 - fogFactor) + v_Color * fogFactor
        vec3 fragColor = mix(u_FogColor, vec3(vec4(diffuse + ambient, v_Color.a)), fogFactor);

        // Mix fog in with frag color
        gl_FragColor = vec4(fragColor, v_Color.a);
        
        // gl_FragColor = vec4(color.rgb * v_NdotL, color.a);
    }
`;

export default fragShader;

