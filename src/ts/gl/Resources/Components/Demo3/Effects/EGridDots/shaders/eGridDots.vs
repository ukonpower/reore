#include <common>
#include <vert_h>
#include <noise_value>

layout (location = 3 ) in vec3 insPos;
layout (location = 4 ) in vec3 insId;

out float vAlpha;

uniform float uTimeE;

void main( void ) {

	#include <vert_in>

	outPos += insPos;
	
	#include <vert_out>

	vAlpha = noiseValue( insPos * 4.0 + vec3( 0.0, 0.0, uTimeE + insId.z * 100.0 ) ) * 0.9;
	
}