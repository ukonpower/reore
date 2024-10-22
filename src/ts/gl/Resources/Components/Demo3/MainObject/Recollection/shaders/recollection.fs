#include <common>
#include <frag_h>
#include <noise_cyclic>
#include <sdf>
#include <rotate>
#include <light>
#include <pmrem>

uniform vec4 uEnding;
uniform vec4 uState;
uniform sampler2D uNoiseTex;

uniform float uTime;
uniform mat4 modelMatrixInverse;
uniform vec2 uResolution;
uniform sampler2D uEnvMap;

vec4 D( vec3 p ) {

	float d = 0.0;
	vec3 size = vec3(
		0.65
	);

	p += vec3( 0.0, 0.0, 0.0 );

	p *= 1.5;
	
	float contentNum = uState.x;
	
	p.xz *= rotate(contentNum * -3.0 + PI);
	p.xz *= rotate(min(1.0,uState.y) * -1.0);
	p.yz *= rotate(-PI/4.0);
 
	p.xy *= rotate(uTime * 0.2 );
	p.xz *= rotate(uTime * 0.2 );

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

	return vec4( d, p.xyz );

}

#include <rm_normal>

float fresnel_( float d ) {
	
	float f0 = 0.01;
	return f0 + ( 1.0 - f0 ) * pow( 1.0 - d, 2.0 );

}

void main( void ) {

	#include <frag_in>
	#include <rm_ray_obj>

	vec4 dist = vec4( 0.0 );
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

	vec3 uvPos = dist.yzw;
	uvPos.xy *= rotate( HPI / 2.0 );
	uvPos.yz *= rotate( HPI / 2.0);

	vec4 n = texture( uNoiseTex, uvPos.xy * 0.5 );
	vec4 vn = texture( uNoiseTex, uvPos.xy * 0.25 );

	outRoughness = n.x;
	outMetalic = 0.0;
	outColor.xyz = vec3( 0.0 );

	vec4 worldNormal = normalize(modelMatrix * vec4( normal, 0.0 ));
	vec4 viewNormal = normalize(viewMatrix * worldNormal);
	outNormal = worldNormal.xyz;

	if( !hit ) discard;

	#ifdef IS_FORWARD

		#include <lighting_forwardIn>

		vec2 uv = gl_FragCoord.xy / uResolution;

		float visibility = smoothstep( 0.0, 0.1, - vn.y + min( 1.0, uState.y ) * 1.1 );

		float dnv = dot( geo.normal, geo.viewDir );
		float ef = fresnel_( dnv );
		float nf = mix( 1.0, smoothstep( 0.03, 0.0, ef), visibility * 0.9 + 0.1 );

		for( int i = 0; i < 16; i++ ) {

			vec2 v = ( viewNormal.xy ) * (float( i + 1 ) / 4.0 * 0.01 * n.x + 0.04);
			outColor.x += nf * texture( uDeferredTexture, uv + v * 1.0 ).x;
			outColor.y += nf * texture( uDeferredTexture, uv + v * 1.5 ).y;
			outColor.z += nf * texture( uDeferredTexture, uv + v * 2.0 ).z;

		}

		outColor.xyz /= 16.0;
		outColor.xyz *= mix( 1.0, 0.3, visibility );
		outColor.w = 1.0;
		outColor.xyz += smoothstep( 0.0, 0.3, length( N( rayPos, 0.02 ) - normal)) * 50.0 * max( uState.y - 1.0, 0.0) * vec3( 1.0, 0.8, 0.8 );

		if( uEnding.x > 0.5 ) {

			outColor.xyz *= 0.0;
			outColor.xyz += (1.0 - dnv) * uEnding.y * 2.0;
			
		}

		#include <lighting_light>
		#include <lighting_env>

	#endif
	
	#include <rm_out_pos>
	#include <frag_out>

}