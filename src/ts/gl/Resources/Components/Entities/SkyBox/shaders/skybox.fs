#include <common>
#include <packing>
#include <frag_h>
#include <noise>
#include <rotate>

uniform float uTimeE;

uniform vec3 cameraPosition;
uniform vec2 uResolution;
uniform float uAspectRatio;

void main( void ) {

	#include <frag_in>

	vec3 normal = normalize( - vNormal );
	outRoughness = 1.0;
	outColor *= 0.0;
	outEmission = vec3( 0.0, 0.05, 0.1);

	#ifdef IS_FORWARD

		outColor = vec4( outEmission * outEmissionIntensity, 1.0 );
	
	#endif

	outEnv = 0.0;

	#include <frag_out>

} 