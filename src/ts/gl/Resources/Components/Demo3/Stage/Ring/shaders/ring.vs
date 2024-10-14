#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

out vec4 vId;

uniform vec4 uState;
uniform float uTime;

void main( void ) {

	#include <vert_in>

	float v = smoothstep( 0.0, 1.0, -(id.x) * 1.0 + uState.x * 2.0 );
	v = easeOut( v, 5.0 );
	float invV = 1.0 - v;

	float l = step( 1.5, length( outPos.xy ) );

	float s = (4.0 + 6.0 * uState.x ) + 1.0 + id.x * 31.0;

	outPos.xy *= s;
	outPos.xy *= mix( 1.0, (1.0 + 1.0 / s * 0.75 * v) * .5 ,l );

	outPos.z *= 2.0 * v;
	outPos.xy *= 0.3;

	mat2 rot;
	
	float r = ( -1.0 + v ) * 1.0;
	
	float t = uTime * 0.1 + id.x * PI / 2.0 + r + 0.0;
	
	rot = rotate( 0.0 );
	outPos.zy *= rot;
	outNormal.zy *= rot;

	rot = rotate( id.x * 0.1 + t );
	outPos.yz *= rot;
	outNormal.yz *= rot;

	rot = rotate( t );
	outPos.xz *= rot;
	outNormal.xz *= rot;
	
	#include <vert_out>

	vId = id;

}