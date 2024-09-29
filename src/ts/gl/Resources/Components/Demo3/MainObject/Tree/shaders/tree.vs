#include <common>
#include <vert_h>

layout(location = 3) in vec3 originPos;
layout(location = 4) in float branchDepth;

uniform float uTimeE;
uniform vec4 uState;
uniform float uTreeDepth;

void main( void ) {

	#include <vert_in>

	outPos -= originPos;

	float branchVis = smoothstep( 0.0, 1.0, (uState.x - branchDepth) * uTreeDepth );

	outPos *= smoothstep( 0.0, 1.0, - uv.y + branchVis * 2.0 );

	outPos += originPos;
	
	#include <vert_out>

}