#include <common>
#include <frag_h>

uniform float uTimeE;
uniform vec4 uMidi;

in float vPosX;


void main( void ) {

	#include <frag_in>

	if( sin( vPosX * 64.0 + uTimeE * 3.0 ) > 0.0) discard;

	outColor = vec4( vec3( 5.0 ), 0.5 );
	
	#include <frag_out>

}