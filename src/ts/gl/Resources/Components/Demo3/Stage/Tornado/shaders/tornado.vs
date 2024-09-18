#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void main( void ) {

	#include <vert_in>

	outPos.y *= 0.0;
	outPos.x -= 0.5;

	outPos.z += id.x * 10.0;


	mat2 rot;
	rot = rotate( position.y * TPI);
	outPos.xy *= rot;
	outNormal.xy *= rot;
	

	// outPos.y -= ( 1.0 - id.x ) * 5.0;
	
	
	#include <vert_out>

}