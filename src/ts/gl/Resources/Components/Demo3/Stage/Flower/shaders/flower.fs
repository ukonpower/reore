#include <common>
#include <frag_h>

in vec3 vOPos;

uniform vec4 uState;

void main( void ) {

	#include <frag_in>
	outSSN = 1.0;

	float f = smoothstep( -0.7, 1.4, vOPos.x );
	outEmissionIntensity = f * 20.0;

	// outEmissionIntensity += smoothstep( -0.4, -0.9, vOPos.x ) * 10.0;

	#include <frag_out>

}