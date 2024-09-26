
#include <common>
#include <vert_h>

uniform sampler2D uGPUSampler0;

layout (location = 3) in vec4 id;

out vec4 vId;

void main( void ) {

	#include <vert_in>

	vec4 gpuPos1 = texture(uGPUSampler0, vec2( id.x ) );
	vec4 gpuPos2 = texture(uGPUSampler0, vec2( id.x + 0.01 ) );

	vec4 gpuModelPosition = modelMatrix * vec4(gpuPos1.xyz, 1.0);
	vec4 gpuMVPosition = viewMatrix * gpuModelPosition;
	vec4 screenGPUPos1 = projectionMatrix * gpuMVPosition;
	screenGPUPos1.xyz /= screenGPUPos1.w;

	gpuModelPosition = modelMatrix * vec4(gpuPos2.xyz, 1.0);
	gpuMVPosition = viewMatrix * gpuModelPosition;
	vec4 screenGPUPos2 = projectionMatrix * gpuMVPosition;
	screenGPUPos2.xyz /= screenGPUPos2.w;

	if( uv.x == 0.0 ) {

		outPos.x = screenGPUPos1.x;

	}

	if( uv.x == 1.0 ) {

		outPos.x = screenGPUPos2.x;

	}

	if( uv.y == 0.0) {

		outPos.y = screenGPUPos1.y;

	}

	if( uv.y == 1.0 ) {

		outPos.y = screenGPUPos2.y;

	}

	#include <vert_out>

	vId = id;

	gl_Position = vec4( outPos.xyz, 1.0 );

}