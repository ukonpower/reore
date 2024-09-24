#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outEmissionIntensity = 12.0;

	#ifdef IS_FORWARD
		outColor = vec4( 1.0 );
	#endif

	#include <frag_out>

}