#include <common>
#include <vert_h>

layout (location = 4) in float id;

void main( void ) {

	#include <vert_in>

	// outPos.x *= 1.0 - abs(id - 0.5) * 1.4;
	outPos.x += (id - 0.5) * 4.0;

	// outPos.z *= 1.2;
	
	#include <vert_out>

	// vUv.x -= id * 3.0;
	vUv.x /= 3.0;
	vUv.x += id;

}