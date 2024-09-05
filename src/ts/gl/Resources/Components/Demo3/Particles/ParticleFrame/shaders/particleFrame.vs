
#include <common>
#include <vert_h>

uniform sampler2D uGPUSampler0;

layout (location = 3) in float id;

void main( void ) {

	#include <vert_in>

	vec4 gpuPos1 = texture(uGPUSampler0, vec2( id ) );
	vec4 gpuPos2 = texture(uGPUSampler0, vec2( id + 0.01 ) );

	if( uv.x == 0.0 && uv.y == 0.0 ) {

		outPos = gpuPos1.xyz;

	}

	if( uv.x == 1.0 && uv.y == 1.0 ) {

		outPos = gpuPos2.xyz;

	}

	if( uv.x == 1.0 && uv.y == 0.0 ) {

		outPos = gpuPos2.xyz;

	}

	if( uv.x == 1.0 && uv.y == 1.0 ) {

		outPos = gpuPos2.xyz;

	}

	#include <vert_out>

}