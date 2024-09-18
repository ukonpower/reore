#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void main( void ) {

	#include <vert_in>

	outPos.xy *= 1.0 + id.x * 1.;
	outPos.xy *= mix( 1.0, 1.0 - id.x * 0.05, step( 0.96, length( position.xy ) ) );

	outPos.xy *= 4.0;

	mat2 rot;
	
	float t = uTime * 0.1 + id.x * PI / 2.0;
	
	rot = rotate( 0.0 );
	outPos.zy *= rot;
	outNormal.zy *= rot;

	rot = rotate( id.x * 0.1 + t );
	outPos.yz *= rot;
	outNormal.yz *= rot;

	
	rot = rotate( t );
	outPos.xz *= rot;
	outNormal.xz *= rot;

	// outPos.y -= ( 1.0 - id.x ) * 5.0;
	
	
	#include <vert_out>

}