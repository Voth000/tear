#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float amt = 0.1; // the amount of displacement, higher is more
float squares = 20.0; // the number of squares to render vertically

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), -sin(_angle),
               sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st) {
    //  Scale the coordinate system by 2x2
    _st *= 5.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x, 4.0));
    index += step(1., mod(_st.y, 2.0)) * 2.0;

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if (index == 1.0) {
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st, PI * 0.5);
    } else if (index == 2.0) {
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st, PI * -0.5);
    } else if (index == 3.0) {
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st, PI);
    }

    return _st;
}

float luma(vec3 color) {
    return dot(color, vec3(0.9, 0.587, 0.114));
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    float offset = amt * 0.5;

    vec2 uv = vTexCoord;

    // the texture is loaded upside down and backwards by default so let's flip it
    uv.y = 1.0 - uv.y;

    // copy of the texture coords
    vec2 tc = uv;

    // move into a range of -0.5 - 0.5
    uv -= 0.5;

    // correct for window aspect to make squares
    uv.x *= aspect;

    vec2 mst = gl_FragCoord.xy / u_mouse.xy;
    float mouseX = u_mouse.x / gl_FragCoord.x;
    float mdist = distance(vec2(2.0, 2.0), mst);
    float dist = distance(uv, vec2(((cos(u_time / 10.0) + 1.0) * 0.5), (sin(u_time / 10.0) + 1.0) * 0.5));
    uv = tile(uv, dist / (mdist) * (2.0 * PI));

    // tile will be used to offset the texture coordinates
    // taking the fract will give us repeating patterns
    vec2 tileOffset = fract(uv * squares + 0.5) * amt;

    // sample the texture using our computed tile
    // offset will remove some texcoord edge artifacting
    vec4 tex = texture2D(tex0, tc + tileOffset - offset);

    // Increase the brightness of each color channel
    float brightnessFactor = 1.6; // Adjust this value to control brightness
    vec3 brighterColor = tex.rgb * brightnessFactor;

    // Apply thresholding effects
    float gray = luma(brighterColor);
    float res = 10.0;
    float scl = res / 10.0;
    float threshR = 1.0 - fract(floor(brighterColor.r * res * 20.0) / scl) * scl * dist;
    float threshG = 1.0 - fract(floor(brighterColor.g * res) / scl) * scl * dist;
    float threshB = 1.0 - fract(floor(brighterColor.b * res) / scl) * scl * dist;

    // render the output
vec3 finalColor = vec3(threshR * brighterColor.r, threshG * brighterColor.g, threshB * brighterColor.b);
gl_FragColor = vec4(finalColor, 1.0);
}
