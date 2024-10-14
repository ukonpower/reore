#include <common>
#include <packing>
#include <frag_h>

uniform sampler2D uNoiseTex;

void main( void ) {

	#include <frag_in>

	float dnv = dot( normalize( vViewNormal ), normalize( -vMVPosition ) );
	vec4 n = texture( uNoiseTex, vUv * 1.0 );
	
	#ifdef KOME

		outRoughness = 0.4;
		outColor.xyz *= vec3( 1.0, 0.90, 0.7 );

	#endif

	#ifdef NEGI

		outColor = vec4( 0.1, 0.5, 0.0, 1.0 );

	#endif

	#ifdef NIKU

		outColor = mix( vec4( 0.94, 0.5, 0.4, 1.0 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif

	#ifdef TAMAGO

		outColor = mix( vec4( 1.0, 0.9, 0.0, 1.00 ), vec4( 1.0, 0.0,0.0, 1.0 ), abs(vUv.x - 0.5) * 0.5 );
		outRoughness = n.x;

	#endif

	#ifdef DUMMY

		outColor.xyz *= vec3( 1.0, 0.90, 0.7 );
		outNormal += (texture( uNoiseTex, vUv.xy * 5.0 ).xyz - 0.5) * 2.0;

	#endif

	#ifdef SHOGA

		outColor = mix( vec4( 1.0, 0.1, 0.3, 1.0 ), vec4( 0.5, 0.0, 0.0 , 1.0 ), abs(vUv.x - 0.5) * 2.0 );
		outRoughness = 0.3;
		outNormal += n.xyz * 0.5;

	#else
		
		float rim = ( 1.0 - dnv * 0.7 );
		outColor.xyz *= 0.45;
		outColor.xyz += rim * vec3( 1.0, 0.6, 0.0 ) * 0.8;
		outEmissionIntensity += rim * 2.0; 
		outRoughness *= 0.1;

	#endif
	

	#include <frag_out>

} 