#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>
#include <noise_simplex>

uniform float uTime;
uniform vec4 uState;

void main( void ) {

	#include <vert_in>	
	
	float y = position.y + 0.5;
	vec3 op = outPos;

	op.x /= 2.0;
	op.z += 0.5;
	op.z *= id.x * 1.0;
	op.x += 0.5 + id.x * 2.0;
	op.y *= 0.0;
	float r = y * TPI * id.w + uTime * id.z * 0.1;
	rotate( -r, op.xy, outNormal.xy);

	outPos = op;
	
	
	#include <vert_out>

}