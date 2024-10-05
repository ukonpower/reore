#include <common>
#include <frag_h>

uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	outColor.xyz = vec3( 1.0, 1.0, 1.0 );

	outEmissionIntensity = 32.0;

	#ifdef IS_SEFIROT

		if( vUv.x > smoothstep( 0.0, 0.5, uState.x ) ) {

			discard;
			
		}
	
	#endif

	#ifdef IS_PASS
	#endif
	
	#include <frag_out>

} 