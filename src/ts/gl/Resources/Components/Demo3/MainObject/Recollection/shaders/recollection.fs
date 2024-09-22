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

vec2 D( vec3 p ) {

	float d = 0.0;
	vec3 size = vec3(
		0.65
	);

	p += vec3( 0.0, 0.0, 0.0 );

	p *= 1.5;
	
	float contentNum = 1.2;
	
	p.xz *= rotate(contentNum);
	vec3 mp = p;

	p.xy *= rotate(uTime * 0.2);
	p.xz *= rotate(uTime * 0.2);
	
	for (int i = 0; i < 2; i++) {

			p.zy = abs(p.zy);
			p.xz *= rotate( -contentNum * 0.3 );

			p.xz = abs(p.xz);
			p.yz *= rotate( -contentNum * 0.9 + length( p  ) * sin( contentNum ) * 2.0  );

			p.xz = abs(p.xz);

			p.xy = abs(p.xy);
			p.xy *= rotate( p.x * sin( contentNum ));

		}

	d = sdBox( p, size );

	return vec2( d, 0.0 );

}

#include <rm_normal>

float fresnel_( float d ) {
	
	float f0 = 0.01;
	return f0 + ( 1.0 - f0 ) * pow( 1.0 - d, 2.0 );

}

void main( void ) {

	#include <frag_in>
	#include <rm_ray_obj>

	vec2 dist = vec2( 0.0 );
	bool hit = false;
	
	for( int i = 0; i < 64; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir * 0.3;

		if( dist.x < 0.01 ) {

			hit = true;
			break;

		}
		
	}

	vec3 normal = N( rayPos, 0.001 );

	outRoughness = 0.2;
	outMetalic = 0.0;
	outColor.xyz = vec3( 0.0 );
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	#ifdef IS_FORWARD

		#include <lighting_forwardIn>

		vec2 uv = gl_FragCoord.xy / uResolution;

		float dnv = dot( geo.normal, geo.viewDir );
		float ef = fresnel_( dnv );
		float nf = smoothstep( 0.03, 0.0, ef);

		for( int i = 0; i < 4; i++ ) {

			vec2 v = ( normal.xy ) * float( i + 1 ) / 4.0 * 0.1;
			outColor.x += nf * texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += nf * texture( uDeferredTexture, uv + v * 1.1 ).y;
			outColor.z += nf * texture( uDeferredTexture, uv + v * 1.2 ).z;

		}

		outColor.xyz /= 4.0;
		outColor.xyz *= 0.3;
		outColor.w = 1.0;

		#include <lighting_light>
		#include <lighting_env>

		vec4 modelPosition = modelMatrix * vec4( rayPos, 1.0 );
		vec4 mvpPosition = projectionMatrix * viewMatrix * modelPosition;

		outPos = modelPosition.xyz;
		gl_FragDepth =  ( mvpPosition.z / mvpPosition.w ) * 0.5 + 0.5;

	#endif
	
	#include <frag_out>

}