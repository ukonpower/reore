#include <common>
#include <frag_h>

uniform sampler2D uTex;
uniform float uVis;

void main( void ) {

	#include <frag_in>

	vec2 uv = vUv;

	float font = texture( uTex, uv ).x;

	outColor = vec4( vec3( 1.0 ), font );
	
	#include <frag_out>

}