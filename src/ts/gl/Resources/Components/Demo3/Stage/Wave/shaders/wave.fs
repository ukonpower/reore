#include <common>
#include <frag_h>

in vec3 vLP;
in vec3 vOP;

void main( void ) {

	#include <frag_in>	
	
	outSSN = 1.0;

	float r =  1.0 - abs(vLP.y ) * 2.5;

	outColor.xyz *= vec3(r, 0.0, 0.0 );

	outColor += smoothstep( 0.1, 0.01, abs( vOP.z ) );
	
	#include <frag_out>

}