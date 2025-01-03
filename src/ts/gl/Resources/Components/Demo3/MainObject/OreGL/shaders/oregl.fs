#include <common>
#include <frag_h>

uniform sampler2D uNoiseTex;	
uniform vec4 uEnding;
uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	vec4 n = texture( uNoiseTex, vUv * 0.5 );
	float v = uState.x - n.a;

	if( v < 0.0 ) discard;

	float emit = smoothstep( 0.03, 0.025, v );
	
	outRoughness = 0.1;
	outMetalic = 0.2;
	
	outEmissionIntensity += max( 0.0, dot( outNormal, vec3( 0.0, 0.5, 1.0 ) ) ) * 0.5 + emit * 10.0 + 0.2;
	
	outColor.xyz = vec3( 0.7 );
	outColor.x += clamp( dot( vNormal, vec3( 1.0, 0.0, -0.2 ) ), 0.0, 1.0 );
	outColor.z += clamp( dot( vNormal, vec3( -1.0, 0.0, 0.2 ) ), 0.0, 1.0 );

	if( uEnding.x > 0.5 ) {

		float dnv = 1.0 - dot( normalize( vViewNormal ), normalize( -vMVPosition ) );

		float w = uEnding.y * dnv;

		outColor.xyz *= 0.0;
		outColor.xyz += w;
		outEmissionIntensity += w * 1.0;
		
	}
	
	#include <frag_out>

}