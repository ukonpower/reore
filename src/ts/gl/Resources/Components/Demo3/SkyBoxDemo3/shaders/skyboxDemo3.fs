#include <common>
#include <packing>
#include <frag_h>
#include <rotate>

uniform float uTimeE;
uniform vec2 uResolution;
uniform float uAspectRatio;

void main( void ) {

	#include <frag_in>

	vec3 normal = normalize( - vNormal );
	outRoughness = 1.0;
	outColor *= 0.0;
	outEmission = vec3( 1.0, 1.0, 1.0 );

	#ifdef IS_FORWARD

		outColor = vec4( outEmission * outEmissionIntensity, 1.0 );
	
	#endif

	outEnv = 0.0;

	#include <frag_out>

} 