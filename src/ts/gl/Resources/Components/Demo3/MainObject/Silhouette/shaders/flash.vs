#include <common>
#include <vert_h>

#include <noise_simplex>

uniform float uTime;

out float vBrightness;

void main( void ) {

	#include <vert_in>

	float w = (1.0 - length( uv.x * 2.0 - 1.0));

	outPos.x *= 4.0;
	outPos.y *= 0.3 * w * w;
	
	#include <vert_out>

	gl_Position.xyz /= gl_Position.w;
	gl_Position.w = 1.0;
	gl_Position.z = -0.9;

	vBrightness = noiseSimplex( vec3( uTime * 3.0 ) ) * 0.5 + 0.5;
	vBrightness = vBrightness * 0.2 + 0.8;
}