#include <common>
#include <frag_h>
#include <noise_cyclic>
#include <sdf>
#include <rotate>
#include <light>
#include <pmrem>

uniform float uTimeE;
uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;
uniform vec2 uResolution;
uniform sampler2D uEnvMap;

vec2 D( vec3 p ) {

	vec3 pp = p;

	float invStateZ = ( 1.0  );

	vec3 r = p;
	r.xy *= rotate( p.z + uTimeE * 0.1 );
	r.xy = pmod( r.xy, 24.0 );
	r.y -= 0.5;

	float wave = sin( r.z * PI * 1.3 + uTimeE * 1.5 );

	vec2 d = vec2( sdSphere( p, 0.75 + wave * 0.1 ), 0.0 );

	d = opSub( d, vec2( sdBox( r, vec3( 0.05 + wave * 0.02,0.6, 1.0 ) ), 0.0 ) );
	
	d = opAdd( d, vec2( sdSphere ( p, 0.18 ), 1.0 ) );

	return d;

	return vec2( d, 0.0 );

}

#include <rm_normal>

void main( void ) {

	#include <frag_in>
	#include <rm_ray_obj>

	vec2 dist = vec2( 0.0 );
	bool hit = false;
	
	for( int i = 0; i < 64; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir * 0.8;

		if( dist.x < 0.01 ) {

			hit = true;
			break;

		}
		
	}

	vec3 normal = N( rayPos, 0.001 );

	outRoughness = 5.0;
	outMetalic = 0.0;
	outColor.xyz = vec3( 1.0, 1.0, 1.0 );

	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;
	
	if( dist.y == 0.0 ) {

		outEmission += length( N( rayPos, 0.01 ) - normal);
		outEmissionIntensity = 4.0;

	} else if( dist.y == 1.0 ) {

		float dnv = dot( normal, -rayDir );

 		outEmission += vec3( 1.0, 0.5, 0.5 ) * exp( fract(  dnv ) * - 5.0 );
		outEmission += 1.0 * ( dnv * 0.8 + 0.2 );
		outEmissionIntensity = 2.0;
		
		
	}
	
	#include <frag_out>

}