#include <common>
#include <vert_h>

layout(location = 5) in vec3 _instancePos;
layout(location = 6) in float _branchDepth;

uniform float uTimeE;
uniform vec4 uState;
uniform float uTreeDepth;
uniform float uTreeDepthScale;

void main( void ) {

	#include <vert_in>

	outPos -= _instancePos;

	float branchVis = smoothstep( 0.0, 1.0, (uState.x * uTreeDepthScale - _branchDepth) * uTreeDepth );

	outPos *= smoothstep( 0.0, 1.0, - uv.y + branchVis * 2.0 );

	outPos += _instancePos;

	#include <vert_out>

}