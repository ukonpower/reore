#include <common>
#include <frag_h>

uniform sampler2D uTuringTex;

void main( void ) {

	#include <frag_in>

	vec4 turingCol = texture( uTuringTex, vUv );
	outColor.xyz = turingCol.xyz;

	
	#include <frag_out>

}