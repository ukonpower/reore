#include <common>
#include <vert_h>

layout (location = 3) in vec2 num;
out vec2 vNum;

void main( void ) {

	#include <vert_in>
	outPos.x += ( num.x - 0.5 ) * 1.3;
	#include <vert_out>

	vNum = num;

}