#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void rott( mat2 rot, inout vec2 pos, inout vec2 normal ) {

	pos *= rot;
	normal *= rot;

}

void main( void ) {

	#include <vert_in>

	outPos.y *= 0.0;

	float py = (position.y + 0.5);

	mat2 rot;

	outPos.xz *= ( 1.0 - py * 0.8 ) * ( 0.07 - id.y * 0.08 );
	outPos.xy += vec2( sin( uTime * 0.5 + id.x * 0.1 ) * 0.3, cos( uTime * 0.5 + id.x * 0.1 ) * 0.3 );

	rott( rotate( 0.73 ), outPos.yz, outNormal.yz );
	rott( rotate( -0.3 ), outPos.xy, outNormal.xy );

	outPos.x -= 0.5 + id.x * 3.0 + py * 1.0 * ( 0.5 + id.x * 0.5) ;
	
	outPos.z -= py * 2.0 + id.x * 0.9 + id.z * 0.0;

	rott( rotate( py * PI * ( 1.0 - id.y * 0.9 )), outPos.xy, outNormal.xy );

	rott( rotate( id.x * TPI * 21.0 ), outPos.xy, outNormal.xy );
	
	#include <vert_out>

}