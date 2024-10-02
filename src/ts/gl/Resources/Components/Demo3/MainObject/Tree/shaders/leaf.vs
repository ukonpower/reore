#include <common>
#include <vert_h>

layout(location = 4) in mat4 instanceMatrix;

uniform float uTimeE;

flat out int vMID;

void main( void ) {

	#include <vert_in>

	outPos.x *= sin( uv.y * PI ) * 0.5;

	outPos = ( instanceMatrix * vec4( outPos, 1.0 ) ).xyz;
	outNormal = ( instanceMatrix * vec4( outNormal, 0.0 ) ).xyz;

	#include <vert_out>

}