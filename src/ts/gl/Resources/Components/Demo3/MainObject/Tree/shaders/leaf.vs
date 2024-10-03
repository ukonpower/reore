#include <common>
#include <vert_h>
#include <noise_simplex>

layout(location = 5) in mat4 instanceMatrix;
layout(location = 9) in vec2 instanceDepth;
layout(location = 10) in vec4 id;

uniform float uTime;
uniform float uTimeE;
uniform vec4 uState;
uniform float uTreeDepth;
uniform float uTreeDepthScale;
uniform float uLeafSize;

#include <rotate>

void main( void ) {

	#include <vert_in>

	float branchVis = smoothstep( 0.0, 1.0, (uState.x *uTreeDepthScale - instanceDepth.x) * uTreeDepth );
	float leafVis = smoothstep( 0.0, 0.5,  - instanceDepth.y + branchVis * 1.5 );

	outPos.x *= sin( uv.y * PI ) * 0.5;
	outPos.z += sin( uv.y * PI ) * 0.1;

	vec3 worldPos = ( instanceMatrix * vec4( vec3( 0.0 ), 1.0 ) ).xyz;

	outPos.y += 0.5;
	outPos *= leafVis;
	outPos.yz *= rotate( -(1.0 - leafVis) * 1.0 );

	float n = noiseSimplex( worldPos * 0.8 + uTime * 0.3 ) * 0.5;

	outPos.yz *= rotate( n );
	outPos.xy *= rotate( n );

	outPos.y -= 0.5;


	outPos *= uLeafSize * (1.0 -  id.x * 0.2);

	outPos = ( instanceMatrix * vec4( outPos, 1.0 ) ).xyz;
	outNormal = ( instanceMatrix * vec4( outNormal, 0.0 ) ).xyz;

	#include <vert_out>

}