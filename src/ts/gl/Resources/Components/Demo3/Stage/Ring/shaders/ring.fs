#include <common>
#include <frag_h>

in vec4 vId;

void main( void ) {

	#include <frag_in>

	// outColor.x -= smoothstep( 0.1, 0.9, vId.y ) * 0.0;
	// outColor.y -= smoothstep( 0.1, 0.9, vId.z ) * 1.0;
	// outColor.z -= smoothstep( 0.1, 0.9, vId.w ) * 1.0;
	// outColor.xyz *= 1.0 - vId.x;

	// outColor.xyz *= 1.0 - vId.y * 1.0;

	outSSN = 1.0;

	#include <frag_out>

}