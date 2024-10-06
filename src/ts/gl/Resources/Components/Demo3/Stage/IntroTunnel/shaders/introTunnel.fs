#include <common>
#include <frag_h>

uniform sampler2D uNoiseTex;

in vec3 vLocalPos;

void main( void ) {

	#include <frag_in>

	outSSN = 1.0;


	vec2 uv = vLocalPos.xy;

	if( abs( vNormal.z ) < 0.5 ) {
		
		uv = vLocalPos.xz;

	}

	vec4 noise = texture( uNoiseTex, uv * 0.1 + 0.1 * texture( uNoiseTex, uv * 0.5 ).xy );

	outRoughness = smoothstep( 0.2, 0.9, noise.x );
	outColor = vec4( 1.0 - ( outRoughness * 0.15 ) );

	// outColor.xyz = vec3( vUv, 1.0 );

	
	#include <frag_out>

}