#include <common>
#include <frag_h>

uniform sampler2D uGPUSampler0;

void main( void ) {

	#include <frag_in>

	outColor.xyz = vec3( 0.0, 0.03, 0.10 );

	float t = smoothstep( 0.0, 0.5, texture( uGPUSampler0, vUv ).x );

	outColor.xyz += t;
	outEmissionIntensity = t;
	
	#ifdef IS_FORWARD

		outColor = vec4( vec3( 0.0, 0.03, 0.10 ) * 2.0, 1.0 );
	
	#endif
	
	#include <frag_out>

}