#include <common>
#include <frag_h>

uniform float uTime;
uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	float w = sin( vUv.y * 10.0 + vUv.x * (PI * 15.0) + uTime * 2.0 );

	if( w < 1.0 - uState.x ) discard;

	outEmissionIntensity = 2.0;
	
	#include <frag_out>

}