#include <common>
#include <vert_h>

layout(location = 8) in mat4 uvMatrix;
layout(location = 4) in mat4 geoMatrix;

void main( void ) {

	#include <vert_in>

	vec4 p = (geoMatrix * vec4( outPos, 1.0 ));

	outPos.xyz = p.xyz;
	
	#include <vert_out>

	vec3 p = outPos.xyz;
	p.x *= 0.5;
	p.y -= modelMatrix[3][1];
	p *= 0.3;
	p.xy += vec2( -0.9, -0.2 );

	gl_Position = vec4( p.xy, 0.9, 1.0 );
	vUv = (uvMatrix * vec4( vUv, 0.0, 1.0 )).xy;


}