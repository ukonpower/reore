#include <common>
#include <vert_h>

layout (location = 3) in vec2 id;

uniform sampler2D uGPUSampler0;
uniform sampler2D uGPUSampler1;
uniform vec2 uGPUResolution;

void main( void ) {

	#include <vert_in>

	vec4 comPosBuffer = texture( uGPUSampler0, vec2( 0.0, id.x ) );
	vec4 comVelBuffer = texture( uGPUSampler1, vec2( 0.0, id.x ) );

	outPos.xyz *= 0.11;
	outPos += comPosBuffer.xyz;
	outPos *= 1.0 - id.y * 0.3;

	vec4 vel = ( projectionMatrix * viewMatrix * modelMatrix * vec4( comVelBuffer.xyz, 0.0 ) );
	
	#include <vert_out>

	vVelocity += vel.xy * 0.05;
}