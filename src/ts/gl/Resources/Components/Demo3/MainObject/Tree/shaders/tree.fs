#include <common>
#include <frag_h>

flat in int vMID;

void main( void ) {

	#include <frag_in>

	if( vMID == 1 ) {

		outColor.xyz = vec3( vUv, 0.0 );
		
	}
	
	#include <frag_out>

}