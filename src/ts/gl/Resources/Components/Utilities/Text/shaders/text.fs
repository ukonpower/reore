#include <common>
#include <frag_h>

uniform sampler2D uTex;

void main( void ) {

	#include <frag_in>

	vec2 uv = vUv;

	float font = texture( uTex, uv ).x;

	// if( font < 0.5 ) discard;

	outColor.xyz = vec3( 0.8 );
	// outEmissionIntensity = font * 10.0;
	
	
	#include <frag_out>

}