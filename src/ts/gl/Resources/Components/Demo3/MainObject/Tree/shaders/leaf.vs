#include <common>
#include <vert_h>

layout(location = 5) in mat4 instanceMatrix;
layout(location = 9) in float instanceDepth;

uniform float uTimeE;
uniform vec4 uState;
uniform float uTreeDepth;

flat out int vMID;

void main( void ) {

	#include <vert_in>

	float branchVis = smoothstep( 0.0, 1.0, (uState.x - instanceDepth) * uTreeDepth );

	outPos *= smoothstep( 0.0, 1.0, - uv.y + branchVis * 2.0 );

	outPos.x *= sin( uv.y * PI ) * 0.5;
	outPos.z += sin( uv.y * PI ) * 0.01;
	outPos.z -= sin( uv.x * PI ) * 0.005;

	outPos = ( instanceMatrix * vec4( outPos, 1.0 ) ).xyz;
	outNormal = ( instanceMatrix * vec4( outNormal, 0.0 ) ).xyz;

	#include <vert_out>

}