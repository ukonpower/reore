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

	float d = 0.0;
	vec3 size = vec3(
		0.65
	);

	p += vec3( 0.0, 0.0, 0.0 );

	p *= 1.5;
	
	float contentNum = 1.2;
	
	p.xz *= rotate(contentNum);
	vec3 mp = p;

	p.xy *= rotate(uTimeE * 0.2);
	p.xz *= rotate(uTimeE * 0.2);
	
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

	outRoughness = 5.0;
	outMetalic = 0.0;
	outColor.xyz = vec3( 1.0, 1.0, 1.0 );

	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	#ifdef IS_FORWARD

		vec2 uv = gl_FragCoord.xy / uResolution;

		for( int i = 0; i < 4; i++ ) {

			vec2 v = ( normal.xy ) * float( i + 1 ) / 4.0 * 0.1;
			outColor.x += texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += texture( uDeferredTexture, uv + v * 1.1 ).y;
			outColor.z += texture( uDeferredTexture, uv + v * 1.2 ).z;

		}

		outColor.xyz /= 4.0;


		#include <lighting_forwardIn>		
		#include <lighting_light>
		#include <lighting_env>



	#endif
	
	
	#include <frag_out>

}