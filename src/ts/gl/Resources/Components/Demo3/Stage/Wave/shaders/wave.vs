#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>
#include <noise_simplex>

uniform float uTime;
uniform float uTimeE;
uniform float uWidth;

void main( void ) {

	#include <vert_in>

	vec3 op = outPos;

	// op.z += 0.5;
	op.z *= 0.2;

	// op.y *= (noiseSimplex( vec3( id.x * 1.5 + uTimeE * 0.1, 0.0, 0.0 ) ) * 0.5 + 0.5) * 2.0;
	op.z *= sin( ( op.y + 0.5 ) * PI );
	op.z *= (noiseSimplex( vec3( id.x * 8.0 + uTime * 0.2, op.y * 2.0, 0.0 ) ) * 0.5 + 0.5) * 4.0;
	op.x += ( id.x * uWidth - uWidth * 0.5 ) ;

	op.zy *= sin( id.x * PI );
	op.yz *= rotate( (id.x - 0.5 ) * 5.0 );



	// op.z += 0.025;

	outPos = op;

	#include <vert_out>

}