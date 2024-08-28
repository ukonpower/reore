#include <common>
#include <frag_h>

uniform sampler2D uTuringTex;
uniform vec2 uGPUResolution;

#define USE_NORMAL_MAP

void main( void ) {

	#include <frag_in>

	vec2 texel = 1.0 / uGPUResolution;

	vec4 turingCenter = texture( uTuringTex, vUv + vec2( 0.0, 0.0 ) );
	vec4 turingTop = texture( uTuringTex, vUv + vec2( 0.0, texel.y ) );
	vec4 turingBottom = texture( uTuringTex, vUv + vec2( 0.0, -texel.y ) );
	vec4 turingLeft = texture( uTuringTex, vUv + vec2( -texel.x, 0.0 ) );
	vec4 turingRight = texture( uTuringTex, vUv + vec2( texel.x, 0.0 ) );

	outNormalMap = normalize( vec3( turingRight.r - turingLeft.r, turingTop.r - turingBottom.r, 1.0 ) );

	#include <frag_out>

}