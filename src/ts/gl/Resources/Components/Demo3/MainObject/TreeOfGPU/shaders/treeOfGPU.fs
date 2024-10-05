#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	outColor.xyz = vec3( 1.0, 1.0, 1.0 );

	outEmissionIntensity = 32.0;
	
	#include <frag_out>

}