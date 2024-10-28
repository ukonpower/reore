#include <common>
#include <frag_h>

#include <noise_cyclic>

uniform float uTime;
uniform vec4 uState;

void main( void ) {

	#include <frag_in>

	float len = length( vUv - 0.5 ) * 2.0;
	float v = smoothstep( 0.0, 0.3, -len + uState.y * 1.3 );
	float w = sin( len * 2.0 + -uState.y * 1.7 );
	
	outColor.xyz = vec3( uState.y );
	
	outNormal += noiseCyc( vPos * 0.3 + vec3( 0.0, 0.0, uTime * 0.2 - w * 1.0 ) ) * 5.0 * v * w;

	outRoughness = ( 1.0 - v * 0.8 );
	
	#include <frag_out>

}