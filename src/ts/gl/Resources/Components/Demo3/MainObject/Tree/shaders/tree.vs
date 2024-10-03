#include <common>
#include <vert_h>

layout(location = 5) in vec3 instancePos;
layout(location = 6) in float branchDepth;

uniform float uTimeE;
uniform vec4 uState;
uniform float uTreeDepth;
uniform float uTreeDepthScale;

void main( void ) {

	#include <vert_in>

	outPos -= instancePos;

	float branchVis = smoothstep( 0.0, 1.0, (uState.x * uTreeDepthScale - branchDepth) * uTreeDepth );

	outPos *= smoothstep( 0.0, 1.0, - uv.y + branchVis * 2.0 );

	outPos += instancePos;

	#include <vert_out>

}