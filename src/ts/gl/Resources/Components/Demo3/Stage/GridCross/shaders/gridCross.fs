#include <common>
#include <frag_h>

uniform float uTime;

void main( void ) {

	#include <frag_in>

	outEmissionIntensity = 0.35;

	
	#include <frag_out>

}