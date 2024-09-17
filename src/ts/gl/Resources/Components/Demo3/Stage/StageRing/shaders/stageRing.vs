#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void main( void ) {

	#include <vert_in>

	outPos.xy *= 1.0 + id.x * 0.6;
	// outPos.xy *= mix( 1.0, 1.0 + (1.0 - id.x) * 0.09, step( 0.95, length( position.xy ) ) );

	outPos.xy *= 3.0;

	mat2 rot = rotate( PI / 2.0 );

	outPos.zy *= rot;
	outNormal.zy *= rot;

	rot = rotate( id.x * 0.9 + uTime * 0.2 );
	outPos.yz *= rot;
	outNormal.yz *= rot;

	
	rot = rotate( uTime * 0.2 + id.x * PI );
	outPos.xz *= rot;
	outNormal.xz *= rot;

	// outPos.y -= ( 1.0 - id.x ) * 2.0;
	
	
	#include <vert_out>

}