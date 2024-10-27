#include <common>
#include <frag_h>
#include <sdf>
#include <rotate>
#include <light>
#include <pmrem>
#include <noise_cyclic>

uniform vec4 uState;
uniform sampler2D uNoiseTex;
uniform float uTime;
uniform mat4 modelMatrixInverse;
uniform vec2 uResolution;
uniform sampler2D uEnvMap;

vec4 D( vec3 p ) {

	vec3 pp = p * 0.5;

	pp *= 0.8;

	pp.xyz += noiseCyc( pp - 0.1 ) * 0.2;

	vec2 d = vec2( sdBox( pp, vec3( 0.5, 0.55, 0.5) ), 0.0 );

	vec3 ppp = pp;
	ppp.z = abs( ppp.z );
	ppp += vec3( 0.5, 0.0, -0.6 );
	ppp.xz *= rotate(  0.5 );
	ppp.yz *= rotate(  0.35 );
	d = opSub( d, vec2( sdBox( ppp, vec3( 1.0, 1.0, 0.2) ), 1.0 ) );
	
	ppp = pp;
	ppp.y = -abs( ppp.y );
	ppp.z = abs( ppp.z );
	ppp += vec3( -0.5, 0.3, -0.55 );
	ppp.xz *= rotate(  -0.9 );
	ppp.yz *= rotate(  0.4 );
	d = opSub( d, vec2( sdBox( ppp, vec3( 1.0, 1.0, 0.2) ), 1.0 ) );

	ppp = pp;
	ppp.z = abs( ppp.z );
	ppp += vec3( 0.6, 0.0, -0.6 );
	ppp.xz *= rotate(  0.7 );
	ppp.yz *= rotate(  -0.35 );
	d = opSub( d, vec2( sdBox( ppp, vec3( 1.0, 1.0, 0.2) ), 1.0 ) );

	// d = opSub( d, vec2( sdBox( ppp, vec3( 1.0, 1.0, 0.13) ), 1.0 ) );

	return vec4( d, p.xyz );

}

#include <rm_normal>


void main( void ) {

	#include <frag_in>
	#include <rm_ray_obj>

	vec4 dist = vec4( 0.0 );
	bool hit = false;
	
	for( int i = 0; i < 64; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir * 0.7;

		if( dist.x < 0.01 ) {

			hit = true;
			break;

		}
		
	}
		

	if( !hit ) discard;

	outRoughness = 0.2;
	outMetalic = 0.0;
	outColor.xyz = vec3( 0.0 );

	vec3 uvPos = dist.yzw;
	uvPos.xy *= rotate( HPI / 2.0 );
	uvPos.yz *= rotate( HPI / 2.0);

	vec4 n = texture( uNoiseTex, uvPos.xy * 0.5 );
	vec4 vn = texture( uNoiseTex, uvPos.xy * 2.0 );
	
	vec3 normal = N( rayPos, 0.01 ) + (vn.yzx - 0.5) * 0.5 * n.y;
	vec4 worldNormal = normalize(modelMatrix * vec4( normal, 0.0 ));
	vec4 viewNormal = normalize(viewMatrix * worldNormal);
	outNormal = worldNormal.xyz;

	outRoughness = n.x ;

	#ifdef IS_FORWARD

		#include <lighting_forwardIn>

		vec2 uv = gl_FragCoord.xy / uResolution;

		float dnv = dot( geo.normal, geo.viewDir );
		float ef = fresnel( dnv );
		float nf = 1.0;

		for( int i = 0; i < 16; i++ ) {

			vec2 v = -( viewNormal.xy ) * (float( i + 1 ) / 4.0 * 0.015 + 0.05);
			outColor.x += nf * texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += nf * texture( uDeferredTexture, uv + v * 1.3 ).y;
			outColor.z += nf * texture( uDeferredTexture, uv + v * 1.6 ).z;

		}

		outColor.xyz /= 16.0;
		outColor.xyz *= vec3( 0.46, 0.5, 0.55 ) * 0.9;
		outColor.w = 1.0;

		outColor.xyz += ef * 4.0;

		#include <lighting_light>
		#include <lighting_env>

	#endif

	outColor.xyz *= 1.0 + uState.y * 100.0;

	#include <rm_out_pos>
	#include <frag_out>

}