#include <common>
#include <frag_h>

uniform sampler2D uTuringTex;
uniform vec2 uGPUResolution;

void main( void ) {

	#include <frag_in>

	vec2 texel = 1.0 / uGPUResolution;

	vec4 turingCenter = texture( uTuringTex, vUv + vec2( 0.0, 0.0 ) );
	vec4 turingTop = texture( uTuringTex, vUv + vec2( 0.0, texel.y ) );
	vec4 turingBottom = texture( uTuringTex, vUv + vec2( 0.0, -texel.y ) );
	vec4 turingLeft = texture( uTuringTex, vUv + vec2( -texel.x, 0.0 ) );
	vec4 turingRight = texture( uTuringTex, vUv + vec2( texel.x, 0.0 ) );

	vec3 normal = normalize( vec3( turingRight.r - turingLeft.r, turingTop.r - turingBottom.r, 0.1 ) );

	outNormal = normalize( normal * 0.1 + outNormal );

	#include <frag_out>

}