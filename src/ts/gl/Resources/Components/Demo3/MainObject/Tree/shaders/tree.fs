#include <common>
#include <frag_h>

uniform sampler2D uNoiseTex;

void main( void ) {

	#include <frag_in>

	// outColor.xyz = vec3( vUv, 0.0 );

	vec4 n = texture( uNoiseTex, vUv * 8.0 );
	outRoughness = n.x * 1.5;

	outColor.xyz *= 1.0 - texture( uNoiseTex, vUv * vec2( 4.0, 3.0 ) ).y * 0.2;
	
	#include <frag_out>

}