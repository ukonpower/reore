#include <common>
#include <frag_h>
#include <light>

uniform sampler2D uNoiseTex;
uniform vec4 uEnding;

void main( void ) {

	#include <frag_in>

	float dnv = dot( vViewNormal, normalize( -vMVPosition ) );
	vec4 n = texture( uNoiseTex, vUv * 1.0 );
	vec3 refEmission = (1.0 - dnv) * vec3( 1.0, 0.6, 0.0 ) * 0.5;

	outRoughness = 0.1;
	
	#ifdef SOUP

		outColor = vec4( 0.6, 0.2, 0.0, 0.8 );

	#endif

	#ifdef NEGI

		outColor = vec4( 0.1, 0.5, 0.0, 1.0 );

	#endif
	
	#ifdef MENMA

		outColor = mix( vec4( 0.94, 0.5, 0.4, 1.0 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif

	#ifdef CHASHU
		
		outColor = mix( vec4( 0.4, 0.3, 0.4, 1.0 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif

	#ifdef NORI

		outColor.xyz = vec3( 0.0, 0.02, 0.0 );
		outRoughness = n.x;
		refEmission *= 0.2;

	#endif
	
	outColor.xyz += refEmission;
	outColor.xyz = mix( outColor.xyz, vec3( 1.0 ), 0.0 );
	// outEmissionIntensity = (1.0 - dnv);

	if( uEnding.x > 0.5 ) {

		float w = uEnding.y * (1.0 - dnv);

		outColor.xyz *= 0.0;
		outEmissionIntensity *= 0.0;
		outColor.xyz += w;
		outEmissionIntensity += w;
		
	}
	
	#include <frag_out>

}