#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	#ifdef IS_FORWARD

		outColor = vec4( 0.5 );
	
	#endif

	outSSN = 1.0;

	
	#include <frag_out>

}