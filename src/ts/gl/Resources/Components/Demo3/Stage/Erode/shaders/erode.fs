#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outColor.xyz = vec3( 0.0, 0.03, 0.10 );
	
	#ifdef IS_FORWARD

		outColor = vec4( vec3( 0.0, 0.03, 0.10 ) * 2.0, 1.0 );
	
	#endif
	
	#include <frag_out>

}