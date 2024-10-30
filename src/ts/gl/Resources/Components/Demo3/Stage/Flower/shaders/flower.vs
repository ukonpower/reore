#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;
uniform float uTimeE;
uniform vec4 uState;// blooming, 

out vec3 vOPos;

void main( void ) {

	#include <vert_in>

	vec3 p = position;

	vOPos = p;

	p.x += 0.5;

	float v = max( 0.0, -id.x + uState.x );
	float s = smoothstep( 0.0, 1.0, -id.x + uState.x * 2.0 );

	float r = v * TPI;

	// slide
	outPos.x += 0.5;
	
	float o = uState.y;
	
	// shape
	outPos.y += pow( p.x, 0.8 - o * 0.2 ) * 2.0;
	outPos.z *= sin( pow(p.x, 0.6 ) * PI );
	outPos.xy *= rotate( -0.3 + o * 0.9 );

	outPos.x += v * 0.2;

	// size
	outPos.xyz *= s * 7.0;

	rotate( r + uTime * 0.2 - HPI, outPos.xz, outNormal.xz );
	
	#include <vert_out>

}