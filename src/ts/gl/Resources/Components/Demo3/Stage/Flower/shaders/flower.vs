#include <common>
#include <vert_h>

layout(location = 4) in vec4 id;

#include <rotate>

uniform float uTime;
uniform float uTimeE;

void main( void ) {

	#include <vert_in>

	vec3 p = position;

	p.x += 0.5;

	float t = uTimeE;
	float r = id.x * TPI + t;

	// size
	outPos.x += 0.1 + 0.4 + id.y;
	// outPos.y += pow( p.x, 2.0 - id.y  );
	rotate( -p.x * 0.9, outPos.xy, outNormal.xy );
	
	outPos.z *= sin( pow(p.x, 0.6) * PI );
	outPos.xyz *= sinn( ( r ) * 0.9 ) * 4.0 + id.y;

	rotate( r + id.y, outPos.xz, outNormal.xz );
	
	#include <vert_out>

}