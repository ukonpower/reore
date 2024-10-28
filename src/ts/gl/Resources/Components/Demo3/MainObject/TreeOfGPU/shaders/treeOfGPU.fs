#include <common>
#include <frag_h>

uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	outColor.xyz = vec3( 1.0, 1.0, 1.0 );

	outEmissionIntensity = 32.0;

	#ifdef IS_SEFIROT

		if( vUv.x > smoothstep( 0.0, 0.5, uState.x ) ) {

			discard;
			
		}
	
	#endif

	#ifdef IS_PASS
	#endif

	#ifdef IS_CIRCLE

		float vb = smoothstep( 0.7, 1.0,  uState.x  );

		float c = 0.0;

		c = 0.5 * vb;
		c *= fract( vUv.x * 4.0 );

		float f = 1.0 - vUv.y;

		c *= f;
		c = mix( c, 1.5, smoothstep( 0.005, 0.0, vUv.y ) * vb );

		outColor.xyz = vec3( c * 0.2 );

	#endif
	
	#include <frag_out>

} 