#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void main( void ) {

	#include <vert_in>

	float r = id.x * 1.0 + uTime * 0.1;

	outPos *= 1.0 + id.x * 1.0;

	rotate( sin( r * 1.5 ), outPos.xy, outNormal.xy );
	rotate( cos( r * 1.0 ), outPos.xz, outNormal.xz );
	
	
	#include <vert_out>

}