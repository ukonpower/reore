#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outRoughness = 0.1;
	outMetalic = 0.2;
	
	outEmission.xyz += dot( outNormal, vec3( 0.0, 0.0, 1.0 ) ) * 0.5;
	
	#include <frag_out>

}