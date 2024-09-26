#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outColor.xyz = vec3( 0.2 );
	outRoughness = 0.1;
	// outMetalic = 0.5;
	
	#include <frag_out>

}