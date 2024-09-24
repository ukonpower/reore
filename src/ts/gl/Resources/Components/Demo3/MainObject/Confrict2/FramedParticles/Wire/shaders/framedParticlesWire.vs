
#include <common>
#include <vert_h>

uniform sampler2D uGPUSampler0;

layout (location = 3) in vec3 id;

void main( void ) {

	#include <vert_in>

	vec4 gpuPos1 = texture(uGPUSampler0, vec2( id.x ) );
	vec4 gpuPos2 = texture(uGPUSampler0, vec2( id.y ) );

	vec4 gpuModelPosition = modelMatrix * vec4(gpuPos1.xyz, 1.0);
	vec4 gpuMVPosition = viewMatrix * gpuModelPosition;
	vec4 screenGPUPos1 = projectionMatrix * gpuMVPosition;
	screenGPUPos1.xyz /= screenGPUPos1.w;

	gpuModelPosition = modelMatrix * vec4(gpuPos2.xyz, 1.0);
	gpuMVPosition = viewMatrix * gpuModelPosition;
	vec4 screenGPUPos2 = projectionMatrix * gpuMVPosition;
	screenGPUPos2.xyz /= screenGPUPos2.w;


	if( position.x < 0.5 ) {
		
		outPos.xy = screenGPUPos1.xy;

	} else {

		outPos.xy = screenGPUPos2.xy;

	}

	#include <vert_out>

	gl_Position = vec4( outPos.xyz, 1.0 );

}