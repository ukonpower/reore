#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>

#define MARCH 64

#ifdef CHAHAN

	uniform vec4 uChState;

#endif

#if defined( GYOZA ) || defined( SHOYU )

	uniform vec4 uState;

#endif

uniform mat4 modelMatrixInverse;
uniform float uTime;
uniform float uTimeSeq;

float smoothAbs(float x)
{
    return sqrt(x*x+1e-3);
}


vec2 D( vec3 p ) {

	vec3 pp = p;
	vec2 d = vec2( 99999.0, 0.0 );
		
	float h = 0.4;
	float r = 0.45 + linearstep( -h * 0.85, h, pp.y ) * 0.5;
	
	d = opAdd( d, vec2( sdCappedCylinder( pp, h, r ), 0.0 ) );
	d = opSub( d, vec2( sdCappedCylinder( pp + vec3( 0.0, -0.1, 0.0 ), h, r * 0.95 ), 0.0 ) );
	d = max( d, pp.y - h * 0.8 );

	d *= 0.9;

	return d;

}

#include <rm_normal>

void main( void ) {

	#include <frag_in>
	#include <rm_ray_obj>

	vec2 dist = vec2( 0.0 );
	bool hit = false;
	
	for( int i = 0; i < MARCH; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir;

		if( dist.x < 0.001 ) {

			hit = true;
			break;

		}
		
	}

	if( !hit ) discard;

	vec3 normal = N( rayPos, 0.001 );

	if( dist.y == 0.0 ) {
		
		outRoughness = 0.1;
		outMetalic = 0.0;
		outColor.xyz = vec3( 1.0, 1.0, 1.0 );
		outColor.yz *= step(  0.3, length( rayPos.y ) );
		
	}
		
	if( !hit ) discard;

	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;
	outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}