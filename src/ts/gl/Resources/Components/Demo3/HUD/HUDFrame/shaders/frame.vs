#include <common>
#include <vert_h>

void main( void ) {

	#include <vert_in>

	outPos.y *= 0.01;

	outPos.y -= 0.85;

	outPos.x += 1.0;
	outPos.x *= 0.4;
	outPos.x -= 1.0;

	gl_Position = vec4( outPos.xy, 0.0, 1.0 );
	vUv = outUv;
	

}