#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void main( void ) {

	#include <vert_in>

	rotate( PI / 2.0, outPos.yz, outNormal.yz );

	outPos.x *= 3.0;

	outPos.z *= sin( uv.x * PI );
	outPos.y += pow( uv.x, 2.0 ) * 0.4;

	outPos.x += 5.0;

	rotate( id.x * TPI, outPos.xz, outNormal.xz );
	
	
	#include <vert_out>

}