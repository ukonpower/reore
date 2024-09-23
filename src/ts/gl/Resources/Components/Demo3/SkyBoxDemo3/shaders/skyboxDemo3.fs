#include <common>
#include <packing>
#include <frag_h>
#include <rotate>

uniform vec4 uState;
uniform float uTimeE;
uniform vec2 uResolution;
uniform float uAspectRatio;

void main( void ) {

	#include <frag_in>

	vec3 normal = normalize( - vNormal );
	outRoughness = 1.0;
	outColor = vec4( 1.0 );

	if( uState.x == 0.0 ) {

		// white
		outColor.xyz = vec3( 1.0, 1.0, 1.0 );
		outEmissionIntensity = 2.0;

	} else if( uState.x == 1.0 ) {

		outColor.xyz = vec3( 0.0, 0.0, 0.0 );
		
	}
	
	#ifdef IS_FORWARD

		outColor = vec4( outColor.xyz, 1.0 );
	
	#endif

	outEnv = 0.0;

	#include <frag_out>

} 