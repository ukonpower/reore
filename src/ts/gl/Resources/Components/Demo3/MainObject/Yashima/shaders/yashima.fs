#include <common>
#include <frag_h>
#include <sdf>
#include <rotate>
#include <light>
#include <pmrem>

uniform vec4 uState;
uniform sampler2D uNoiseTex;
uniform float uTime;
uniform mat4 modelMatrixInverse;
uniform vec2 uResolution;
uniform sampler2D uEnvMap;

vec2 D( vec3 p ) {

	vec3 pp = p * 0.5;

	vec2 d = vec2( sdSphere( pp, 0.03 ), 0.0 );

	float b = uState.x + -2.0;
	
	pp.yz *= rotate( b * HPI );

	for( int i = 0; i < 4; i++ ) {

		pp.z = abs( pp.z );
		pp.zy *= rotate( b * PI / 4.0 );
		pp.xz *= rotate( b * PI / 2.0 );

	}



	pp.y = abs( pp.y );
	pp.y -= 0.03;

	d = opAdd( d, vec2( sdPyramid( pp, 0.7 ), 1.0 ) );

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
		rayPos += dist.x * rayDir * 0.7;

		if( dist.x < 0.01 ) {

			hit = true;
			break;

		}
		
	}
		

	if( !hit ) discard;

	outRoughness = 0.0;
	outMetalic = 0.0;
	outColor.xyz = vec3( 0.0 );

	vec3 normal = N( rayPos, 0.01 );
	vec4 worldNormal = normalize(modelMatrix * vec4( normal, 0.0 ));
	vec4 viewNormal = normalize(viewMatrix * worldNormal);
	outNormal = worldNormal.xyz;

	vec4 n = vec4(0.0);
	vec4 vn = vec4( 0.0 );

	#ifdef IS_FORWARD

		#include <lighting_forwardIn>

		vec2 uv = gl_FragCoord.xy / uResolution;

		float dnv = dot( geo.normal, geo.viewDir );
		float ef = fresnel( dnv );
		float nf = 1.0;

		for( int i = 0; i < 16; i++ ) {

			vec2 v = ( viewNormal.xy ) * (float( i + 1 ) / 4.0 * 0.015 + 0.025);
			outColor.x += nf * texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += nf * texture( uDeferredTexture, uv + v * 2.0 ).y;
			outColor.z += nf * texture( uDeferredTexture, uv + v * 4.0 ).z;

		}

		outColor.xyz /= 16.0;
		outColor.xyz *= vec3( 0.0, 0.05, 0.1 ) + 0.1;
		outColor.w = 1.0;

		#include <lighting_light>
		#include <lighting_env>

	#endif

	outColor.xyz *= 1.0 + uState.y * 100.0;

	#include <rm_out_pos>
	#include <frag_out>

}