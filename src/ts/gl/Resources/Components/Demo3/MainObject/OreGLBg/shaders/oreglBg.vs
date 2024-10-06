#include <common>
#include <vert_h>
#include <rotate>

layout (location = 4) in float id;

uniform vec4 uState;

out float vFront;
out float vVis;

void main( void ) {

	#include <vert_in>

	vFront = max( 0.0, dot( outNormal, vec3( 0.0, 0.0, 1.0  ) ) );

	float v = smoothstep( 0.0, 1.0, -id * 0.1 + uState.x * 1.1 );

	outPos.y += (1.0 - v) * 2.0;
	
	rotate( (1.0 - v) * PI, outPos.xz, outNormal.xz );
	
	outPos.x += (id - 0.5) * 4.0;
	
	#include <vert_out>

	vUv.x /= 3.0;
	vUv.x += id;
	vVis = v;

}