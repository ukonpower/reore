#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;

void main( void ) {

	#include <vert_in>

	outPos.y *= 0.0;

	float py = (position.y + 0.5);

	mat2 rot;

	outPos.xz *= ( 1.0 - py * 0.8 ) * mix( 0.08, 0.05, id.x );

	float rt = uTime * -0.3 + id.x * 2.0 + py * HPI * 0.7 + 3.0;
	outPos.xy += vec2( sin( rt ) * 0.3, cos( rt ) * 0.3 );

	rotate( 0.73, outPos.yz, outNormal.yz );
	rotate( -0.3, outPos.xy, outNormal.xy );

	outPos.x -=  id.x * 3.0 + py * (id.x * id.x) * 10.0 ;
	
	outPos.x -= 0.5;

	outPos.z -= py * 1.0 + id.x * 0.5 + id.z * 0.0;
	
	rotate( py * PI * 0.5, outPos.xy, outNormal.xy );

	rotate( pow(id.x, 0.8) * TPI * 20.0, outPos.xy, outNormal.xy );
	
	#include <vert_out>

}