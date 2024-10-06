#include <common>
#include <frag_h>
#include <noise_simplex>

uniform float uTime;

in float vFront;
in float vVis;

void main( void ) {

	#include <frag_in>

    vec3 c = vec3(0.2,0.2,1.0);
    float t = uTime;
    vec2 uv = vUv;

    t *= 0.1;
    // uv *= 0.5;
    float n = noiseSimplex(vec3(uv,t)) * 0.3;
    c.x -= n;
    c.y -= n * 2.0;
    c.z -= n;

	c = mix( vec3( 1.0 ), c, vFront );

    float emit = step( 0.5, sin(smoothstep( 0.90, 0.95, vVis ) * PI * 4.5 ) );
    
    c = mix( vec3( 1.0 ), c, emit );

	outColor.xyz *= mix( vec3( 1.0 ), c, vFront);
	outEmissionIntensity = 7.0 * ( vFront ) * emit;
	outRoughness = 0.2;

	#include <frag_out>

}