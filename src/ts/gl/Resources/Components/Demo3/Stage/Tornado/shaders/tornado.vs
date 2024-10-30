#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;
uniform vec4 uState;

out vec3 vOPos;
out float vOpen;

void main( void ) {

	#include <vert_in>

	float open = smoothstep( 0.0, 0.8, - (id.x) + uState.x * 1.8 );
	vOpen = open;

	vOPos = outPos;

	outPos.zx *= 0.8;
	outPos.y *= 0.0;

	float py = (position.y + 0.5);

	mat2 rot;

	outPos.xz *= ( 1.0 - py * 0.8 ) * mix( 0.08, 0.05, id.x );

	float rt = uTime * -0.4 + id.x * 4.0 + py * HPI * 1.0 + 3.0;
	outPos.xy += vec2( sin( rt ) * 0.3, cos( rt ) * 0.3 ) * 0.5 - 0.1 ;

	rotate( 0.73, outPos.yz, outNormal.yz );

	outPos.x -= id.x * 3.0 + py * (id.x * id.x) * 10.0 ;
	outPos.x -= 0.5;

	float oo = open * py * 3.0 * smoothstep( 0.5, 0.0, id.x );

	outPos.x -= open * 2.0 * id.x;

	outPos.z -= py * 1.0 + id.x * 0.5;
	
	outPos.x += oo;
	rotate( py * PI * 0.5 - open, outPos.xy, outNormal.xy );

	
	outPos.y -= open * 0.6;

	rotate( pow(id.x, 0.8) * TPI * 20.0 , outPos.xy, outNormal.xy );
	
	#include <vert_out>

}