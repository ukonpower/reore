#include <common>
#include <vert_h>

out float vIsFront;

void main( void ) {

	#include <vert_in>

	vIsFront = step( 0.5, abs( dot( normal, vec3( 0.0, 0.0, 1.0 ) ) ) );
	
	#include <vert_out>

}