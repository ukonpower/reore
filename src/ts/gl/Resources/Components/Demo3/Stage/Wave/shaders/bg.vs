#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>


void main( void ) {

	#include <vert_in>

	// outPos.z += - 0.05;
	outPos.y *= 1.5;

	#include <vert_out>

}