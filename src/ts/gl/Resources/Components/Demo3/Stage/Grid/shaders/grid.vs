#include <common>
#include <vert_h>

layout ( location = 3 ) in vec4 id;

#define GRID 8.0

#include <rotate>

void main( void ) {

	#include <vert_in>

	vec3 uNum = vec3( 100, 4, 10 );

	vec3 op = outPos;
	op *= 0.002;

	op *= floor(1.0 - mod( id.x * uNum.x, uNum.z ) / uNum.z ) + 0.5;

	vec3 oPos = vec3( 0.0 );
	vec2 xz = id.xz - 0.5;

	oPos.xz += xz * 1.0;
	op += oPos;
	op.xz *= rotate( id.w * PI / 2.0 );

	outPos = op;
	
	#include <vert_out>

}