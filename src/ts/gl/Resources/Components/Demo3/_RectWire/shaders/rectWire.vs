#include <common>
#include <vert_h>

layout (location=3) in vec3 instancePos;
layout (location=4) in vec3 instanceRot;

out float vPosX;

#include <rotate>

void main( void ) {

	#include <vert_in>

	vPosX = outPos.x;

	outPos.xy *= rotate( instanceRot.z );
	outPos += instancePos;

	#include <vert_out>

}