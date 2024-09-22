#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;
uniform float uTimeE;
uniform vec4 uState;// blooming, 

void main( void ) {

	#include <vert_in>

	vec3 p = position;

	p.x += 0.5;

	float v = max( 0.0, -id.x + uState.x );
	float r = v * TPI * 1.0;

	// slide
	outPos.x += 0.5;
	
	// shape
	outPos.y += pow( p.x, 0.6 ) * 1.5;
	outPos.z *= sin( pow(p.x, 0.6) * PI );
	outPos.xy *= rotate( id.x * 3.0 * uState.x * smoothstep( 0.5, 1.0, uState.x ) );

	outPos.x += v * 0.2;
	outPos.y += v * 0.5;

	// size
	outPos.xyz *= smoothstep( 0.0, 0.8, v ) * 7.0;

	rotate( r * 1.8, outPos.xz, outNormal.xz );
	
	#include <vert_out>

}