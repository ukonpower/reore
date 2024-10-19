#include <common>
#include <frag_h>

uniform vec4 uState;

#ifdef IS_TRAILS
	in float vRnd;
#endif

void main( void ) {

	#include <frag_in>

	outColor = vec4( 1.0 );

	#ifdef IS_TRAILS

		float v = smoothstep( 0.0, 1.0, -vRnd * 0.25 + uState.x * 1.25 );

		if( v < vUv.y ) {

			discard;
			
		}

	#endif

	outEmissionIntensity = 8.0 - uState.x * 4.8;
	
	#include <frag_out>

}