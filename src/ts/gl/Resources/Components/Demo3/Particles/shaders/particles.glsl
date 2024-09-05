#include <common>
#include <noise>

layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;

uniform sampler2D uGPUSampler0;
uniform sampler2D uGPUSampler1;
uniform vec2 uGPUResolution;
uniform float uTimeE;

in vec2 vUv;

#include <noise4D>
#include <rotate>

void main( void ) {

	float t = uTimeE * 0.8;
	float id = vUv.x + vUv.y * uGPUResolution.x;

	vec4 position = texture( uGPUSampler0, vUv );
	vec4 velocity = texture( uGPUSampler1, vUv );

	// velocity

	float tOffset = id * 0.015;
	vec3 noisePosition = position.xyz * 0.15;

	vec3 noise = noiseCyc( noisePosition * 9.0 + vec3( 0.0, -t, 0.0 ) + tOffset );

	noise = noise * 0.005;
	velocity.xyz += noise;
	velocity.y += 0.0005;

	//  position

	position.xyz += velocity.xyz;

	// lifetime

	if( position.w > 1.0 ) {

	
		position = vec4( 1.0, 0.0, 0.0, 0.0 );

		velocity = vec4( 0.0 );

	}

	position.w += 0.016 / 2.0;

	// out

	outColor0 = position;
	outColor1 = velocity;

} 