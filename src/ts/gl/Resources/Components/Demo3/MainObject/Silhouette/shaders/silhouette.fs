#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outColor = vec4( 1.0 );
	outEmissionIntensity = 8.0;
	
	#include <frag_out>

}