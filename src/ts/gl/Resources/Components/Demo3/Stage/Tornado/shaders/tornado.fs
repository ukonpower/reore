#include <common>
#include <frag_h>

uniform vec4 uState;

in vec3 vOPos;

void main( void ) {

	#include <frag_in>

	float v = ( vOPos.y * 0.5 + 0.5 );
	v = 1.0 - v;

	// outEmissionIntensity = smoothstep( 0.0, 0.1, -v + uState.x * 1.1 ) * 5.0;
	
	#include <frag_out>

}