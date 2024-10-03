#include <common>
#include <frag_h>
#include <sdf>
#include <rotate>
#include <noise_cyclic>

uniform mat4 modelMatrixInverse;
uniform float uTimeE;


vec2 D( vec3 p ) {

	vec3 n = noiseCyc( p.xyz * 3.5 + 11.0 );
	p.y += (n.x * 0.5 + 0.5) * 0.15;
	p.y += 1.0;

	vec2 d = vec2( sdBox( p, vec3( 1.0 ) ), 1.0 );


	return d;

}

#include <rm_normal>

void main( void ) {

	#include <frag_in>
	#include <rm_ray_obj>

	vec2 dist = vec2( 0.0 );
	bool hit = false;
	
	for( int i = 0; i < 32; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir * 0.8;

		if( dist.x < 0.01 ) {

			hit = true;
			break;

		}
		
	}

	vec3 normal = N( rayPos, 0.001 );

	if( !hit ) discard;

	
	outRoughness = 0.1;
	outMetalic = 0.0;
	outColor.xyz = vec3( 1.0, 1.0, 1.0 );
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;
	
	vec4 modelPosition = modelMatrix * vec4( rayPos, 1.0 );
	vec4 mvpPosition = projectionMatrix * viewMatrix * modelPosition;

	outPos = modelPosition.xyz;
	gl_FragDepth = ( mvpPosition.z / mvpPosition.w ) * 0.5 + 0.5;

	
	
	#include <frag_out>

}