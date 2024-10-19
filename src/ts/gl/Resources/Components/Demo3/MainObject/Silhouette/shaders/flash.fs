#include <common>
#include <frag_h>

in float vBrightness;

void main( void ) {

	#include <frag_in>

	outColor = vec4( 1.0 );
	outColor.xyz *= 8.0;

	float w = 1.0 - length( vUv.x - 0.5 ) * 2.0;

	outColor.w = w * w * w * vBrightness;
	outColor.w *= 1.0-  length( vUv.y - 0.5 ) * 2.0;
	
	#include <frag_out>


}