#include <common>
#include <frag_h>

uniform sampler2D uNoiseTex;

in vec4 vId;

void main( void ) {

	#include <frag_in>

	// outSSN = 1.0;

	vec2 uv = vUv;
	uv.x *= 0.5;

	outRoughness = 0.1 + texture( uNoiseTex, uv * 4.0 ).x * 0.3;

	// outColor.xyz *= smoothstep( 1.0, 0.0, vId.x );
	// outColor *= 1.0 - vUv.y * 1.0;
	// outColor.x *= vId.y;
	// outColor.y *= 1.0 - vUv.y * 1.0;
	
	#include <frag_out>

}