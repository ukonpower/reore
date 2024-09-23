#include <common>
#include <frag_h>
#include <noise_simplex>
uniform float uTime;

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

	float front = max( 0.0, dot( outNormal, vec3( 0.0, 0.0, 1.0  ) ) );

	c = mix( vec3( 1.0 ), c, front );

	outColor.xyz *= mix( vec3( 1.0 ), c, front);
	outEmissionIntensity = 7.0 * ( front );
	outRoughness = 0.2;

	#include <frag_out>

}