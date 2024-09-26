
#include <common>
#include <vert_h>

uniform sampler2D uGPUSampler0;

layout (location = 3) in vec3 id;

void main( void ) {

	#include <vert_in>

	vec4 gpuPos1 = texture(uGPUSampler0, vec2( id.x ) );
	vec4 gpuPos2 = texture(uGPUSampler0, vec2( id.y ) );

	if( position.x < 0.5 ) {
		
		outPos = gpuPos1.xyz;

	} else {

		outPos = gpuPos2.xyz;

	}

	#include <vert_out>

}