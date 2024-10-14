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
		
		
	#ifdef CHAHAN

		pp.xz *= rotate( PI / 8.0 );

		float n = 8.0;
		float h=floor(log2(n));
		float a =TPI*exp2(h)/n;

		for( int i = 0; i < int( h ) + 2; i++ ) {

			vec2 v = vec2( -cos( a ), sin( a ) );  
			float g = dot( pp.xz, v );
			pp.xz -= ( g - smoothAbs( g ) ) * v;
			a *= 0.5;
			
		}

		pp.y -= -0.15 + ( 1.0 - pow( 1.0 - linearstep( 0.5, 1.0, length( pp.xz ) ), 2.0 ) ) * 0.3;
		
		d = opAdd( d, vec2( opRound( sdBox( pp, vec3( 0.85, 0.015, 0.85 ) ), 0.01 ), 0.0 ) );

	#endif
		
	#ifdef RAMEN

		float h = 0.4;
		float r = 0.45 + linearstep( -h * 0.85, h, pp.y ) * 0.5;
		
		d = opAdd( d, vec2( sdCappedCylinder( pp, h, r ), 0.0 ) );
		d = opSub( d, vec2( sdCappedCylinder( pp + vec3( 0.0, -0.1, 0.0 ), h, r * 0.95 ), 0.0 ) );
		d = max( d, pp.y - h * 0.8 );

		d *= 0.9;
		
	#endif

	#ifdef GYOZA

		pp *= 0.8;
		pp.x *= 0.6;

		float v = 1.0;

		pp.y += ( 1.0 - v ) * 0.5;

		float o = -0.3 + 0.8 * v;
		vec2 q = vec2( length(pp.xz) - o, pp.y );

		vec2 q1 = q;
		q1.xy *= rotate( -1.1 );
		d = opAdd( d, vec2( sdBox( vec3( q1, 0.0 ), vec3( 0.01, 0.18, 1.0 )), 0.0 ) );

		vec2 q2 = q;
		q2.x += 0.4;
		q2.y += 0.11;
		d = opAdd( d, vec2( sdBox( vec3( q2, 0.0 ), vec3( 0.3, 0.04, 0.1  )), 0.0 ) );

	#endif

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
		rayPos += dist.x * rayDir * 0.7;

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
		outColor.yz *= 0.9 + step(  0.3, length( rayPos.y ) );
		
	}
		
	if( !hit ) discard;

	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;
	#include <rm_out_pos>

	#include <frag_out>

}