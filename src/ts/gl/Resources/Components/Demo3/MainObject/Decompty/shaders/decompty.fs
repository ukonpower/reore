#include <common>
#include <frag_h>
#include <noise_cyclic>
#include <sdf>
#include <rotate>
#include <light>
#include <pmrem>

uniform float uTime;
uniform mat4 modelMatrixInverse;
uniform vec2 uResolution;
uniform sampler2D uEnvMap;

uniform vec4 uState;

vec2 D( vec3 p ) {

	vec3 pp = p;

	float invStateZ = ( 1.0 - uState.z );

	vec3 r = p;
	r.xy *= rotate( p.z + uTime * 0.1 );
	r.xy = pmod( r.xy, 24.0 );
	r.y -= 0.5;

	float wave = sin( r.z * PI * 1.3 - uTime * 1.5 ) * ( 1.0 - uState.x );

	vec2 d = vec2( sdSphere( p, 0.75 + wave * 0.1 + uState.x * 0.2 ), 0.0 );

	d = opSub( d, vec2( sdBox( r, vec3( 0.05 + wave * 0.02 + uState.x * 0.02 ,0.6, 1.0 ) ), 0.0 ) );
	
	d = opAdd( d, vec2( sdSphere ( p, 0.18 ), 1.0 ) );

	return d;

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

		outEmissionIntensity += length( N( rayPos, 0.01 ) - normal) * 10.0 * uState.x;

	} else if( dist.y == 1.0 ) {

		float dnv = dot( normal, -rayDir );
		outColor.xyz = vec3( 1.0, 0.5, 0.5 );
		outEmissionIntensity = exp( fract(uTime / 3.0 + dnv ) * -5.0 ) * 4.0;

		float kaigan = smoothstep( 0.0, 1.0, sinn( uState.y * PI * 5.0 )  );
		outColor.xyz = mix( outColor.xyz, vec3(( dnv * 0.5 + 0.5 )), kaigan );
		outEmissionIntensity = mix( outEmissionIntensity, dnv * 5.0, kaigan );
		
	}

	outEmissionIntensity += uState.z * 10.0;

	#include <rm_out_pos>	
	#include <frag_out>

}