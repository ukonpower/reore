#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;
uniform vec4 uState;

out vec3 vLocalPos;

void main( void ) {

	#include <vert_in>

	mat2 rot;
	

	rot = rotate( PI / -2.0 + (id.x) * PI * 1.0 );
	outPos.xy *= rot;
	outNormal.xy *= rot;

	vLocalPos = outPos;

	float m = 0.0 + (1.0 - uState.x) * 0.9;
	outPos.z += ( id.x ) * 12.0;
	
	
	#include <vert_out>

}