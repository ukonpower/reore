#include <common>
#include <frag_h>

uniform sampler2D uGPUSampler0;
uniform vec2 uGPUResolution;

in float vIsFront;

#define USE_NORMAL_MAP


void main( void ) {

	#include <frag_in>

	vec2 uv = vUv;

	if( vIsFront < 0.5 ) {
		uv.x *= 0.1;
	}

	outColor.xyz = vec3( 0.0, 0.03, 0.10 );

	vec2 texel = 1.0 / uGPUResolution;

	vec4 turingCenter = texture( uGPUSampler0, uv + vec2( 0.0, 0.0 ) );
	vec4 turingTop = texture( uGPUSampler0, uv + vec2( 0.0, texel.y ) );
	vec4 turingBottom = texture( uGPUSampler0, uv + vec2( 0.0, -texel.y ) );
	vec4 turingLeft = texture( uGPUSampler0, uv + vec2( -texel.x, 0.0 ) );
	vec4 turingRight = texture( uGPUSampler0, uv + vec2( texel.x, 0.0 ) );

	outNormalMap = normalize( vec3( turingRight.x - turingLeft.x, turingTop.x - turingBottom.x, 0.1 ) );

	float w = 1.0 - turingCenter.x;

	outColor.xyz += w;
	outRoughness = 0.2;

	
	
	#include <frag_out>

}