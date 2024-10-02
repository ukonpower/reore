#include <common>
#include <vert_h>

layout(location = 5) in vec3 instancePos;
layout(location = 6) in float branchDepth;
layout(location = 7) in int mid;

uniform float uTimeE;
uniform vec4 uState;
uniform float uTreeDepth;

flat out int vMID;

void main( void ) {

	#include <vert_in>

	outPos -= instancePos;

	float branchVis = smoothstep( 0.0, 1.0, (uState.x - branchDepth) * uTreeDepth );

	if( mid == 0 ) {
		// tree

		outPos *= smoothstep( 0.0, 1.0, - uv.y + branchVis * 2.0 );

	} else if( mid == 1 ) {
		// leaf

		outPos.x *= sin( uv.y * PI );
		outPos *= smoothstep( 0.0, 1.0, branchVis );

	}

	outPos += instancePos;

	vMID = mid;

	#include <vert_out>

}