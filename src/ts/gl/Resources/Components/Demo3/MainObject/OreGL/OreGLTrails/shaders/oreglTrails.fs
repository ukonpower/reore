#include <common>
#include <frag_h>

uniform vec4 uState;

void main( void ) {

	#include <frag_in>
	
	float v = uState.x - (1.0 - vUv.y);

	if( v < 0.0 ) discard;

	float emit = smoothstep( 0.03, 0.025, v );

	#ifdef IS_FORWARD

		outColor = vec4( 0.5 );
	
	#endif

	outSSN = 1.0;

	outEmissionIntensity += emit * 10.0;

	
	#include <frag_out>

}