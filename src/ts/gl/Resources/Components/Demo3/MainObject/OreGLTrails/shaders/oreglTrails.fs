#include <common>
#include <frag_h>

uniform vec4 uState;

void main( void ) {

	#include <frag_in>
	
	float v = uState.x - (1.0 - vUv.y);

	if( v < 0.0 ) discard;

	float emit = smoothstep( 0.03, 0.025, v );

	outColor.xyz = vec3( 0.4, 0.15, 0.4 );

	outColor.x += clamp( dot( vNormal, vec3( -1.0, 0.0, 0.0 ) ), 0.0, 1.0 );
	outColor.z += clamp( dot( vNormal, vec3( 1.0, 0.0, 0.0 ) ), 0.0, 1.0 );
	

	#ifdef IS_FORWARD

		outColor = vec4( 0.5 );
	
	#endif

	outSSN = 1.0;

	outColor.xyz += emit;
	outEmissionIntensity += emit * 10.0;

	
	#include <frag_out>

}