#include <common>
#include <frag_h>

uniform vec4 uState;

in vec3 vOPos;
in float vOpen;

void main( void ) {

	#include <frag_in>

	float v = ( vOPos.y * 0.5 + 0.5 );
	v = 1.0 - v;

	float dnv = dot( vViewNormal, normalize( -vMVPosition ) );

	// outEmissionIntensity = smoothstep( 0.0, 0.1, -v + uState.x * 1.1 ) * 5.0;

	outEmissionIntensity = vOpen * smoothstep( 0.01, 0.0, dnv ) * 9.0;

	outSSN = 1.0;
	
	#include <frag_out>

}