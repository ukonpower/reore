#include <common>
#include <vert_h>

layout (location = 3) in vec2 trailId;
layout (location = 4) in vec3 id;
layout (location = 5) in float posY;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;
uniform vec2 uGPUResolution;

#include <rotate>

void main( void ) {

	#include <vert_in>

	float uid = id.x + id.y * 128.0;

	vec4 comPosBuffer = texture( gpuSampler0, vec2( posY * 1.0, trailId ) );
	vec4 comVelBuffer = texture( gpuSampler1, vec2( posY * 1.0, trailId ) );
    vec4 nextPosBuffer = texture( gpuSampler0, vec2( posY - 1.0 / uGPUResolution.x, trailId ) );

	vec3 offsetPosition = comPosBuffer.xyz;

	outPos.xz *= sin( trailId * TPI ) * 0.5 + 0.5;
	
    vec3 delta = ( comPosBuffer.xyz - nextPosBuffer.xyz );
	vec3 vec = normalize( delta );

	mat2 offsetRot = rotate( PI / 2.0 );
	outPos.yz *= offsetRot;
	outNormal.yz *= offsetRot;

	mat3 rot = makeRotationDir(-vec, vec3( 0.0, -1.0, 0.0 ) );
	outPos *= rot;
	outNormal *= rot;

	outPos += offsetPosition;

	#include <vert_out>
	
}