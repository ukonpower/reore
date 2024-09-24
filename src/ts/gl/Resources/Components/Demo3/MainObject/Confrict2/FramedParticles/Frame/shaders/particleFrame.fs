#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>
	outColor.xyz *= 0.2;
	#include <frag_out>

}