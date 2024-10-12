#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>
#include <noise_simplex>

uniform vec4 uState;
uniform float uTime;
uniform float uTimeE;
uniform float uWidth;

out vec3 vLP;
out vec3 vOP;

void main( void ) {

	#include <vert_in>

	vec3 op = outPos;

	vLP = op;

	float v = smoothstep( 0.0, 0.5, -abs(id.x - 0.5 ) * 2.0 + uState.x * 1.5 );
	v = easeBounce( v, 2.5 );

	// op.z += 0.5;
	
	op.z *= 0.2;
	op.zy *= v;

	// op.x *= 1.0 - sinn( id.x * TPI * 8.0 ) * 0.8;

	// op.y *= (noiseSimplex( vec3( id.x * 1.5 + uTimeE * 0.1, 0.0, 0.0 ) ) * 0.5 + 0.5) * 2.0;
	op.z *= sin( ( vLP.y + 0.5 ) * PI );
	op.z *= (noiseSimplex( vec3( id.x * 8.0 + uTime * 0.1, op.y * 2.0 + uTime * 0.1, 0.0 ) ) * 0.5 + 0.5) * 4.0;
	op.x += ( id.x * uWidth - uWidth * 0.5 ) ;

	op.zy *= sin( id.x * PI );
	op.yz *= rotate( (id.x - 0.5 ) * 16.0 + uTime * -0.1 - HPI + ( 1.0 - v  ) * PI );

	// op.z += 0.025;

	outPos = op;

	vOP = outPos;

	#include <vert_out>

}