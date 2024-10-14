#include <common>
#include <frag_h>
#include <sdf>
#include <rotate>

uniform sampler2D uNoiseTex;
uniform mat4 modelMatrixInverse;
in vec2 vNum;

vec2 D( vec3 p ) {
	
	p *= 0.9;

	p.x -= ( vNum.x - 0.5 ) * 1.3;
	p.y -= abs( vNum.x - 0.5 ) * 0.1 + 0.02;

	p.xz *= rotate( PI * 0.5 );
	p.zy *= rotate( PI );

	p.y *= 1.2;

	p += vec3( 0.0, 0.05, 0.05 );

	vec2 d = vec2( 99999.0, 0.0 );
	vec3 pp = p;

    float c = cos(pp.x);
    float s = sin(pp.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*pp.xz,pp.y);

	vec3 p2 = q;
	p2.y *= 1.0;
	d = opAdd( d, vec2( sdVesicaSegment( p2, vec3(-0.4, 0.0, 0.0 ), vec3(0.4, 0.0, 0.0 ), 0.18 ), 0.0 ) );

	vec3 pq = p;
	pq.z += sin( pq.x * 45.0 ) * 0.03;
	pq.z -= -0.05 + sin( abs( pq.x ) ) * 0.12;
	vec3 p3 = vec3(m*pq.xz,pq.y);
	p3.z *= 1.4;
	d.x = opSmoothAdd( d.x, max( sdRoundedCylinder( p3, 0.2, 0.008, 0.005 ), -p.y ), 0.05 );

	d.x = opSmoothSubtraction( sdBox( pp + vec3( 0.0, 0.3, 0.0 ), vec3( 0.5, 0.2, 0.2 ) ), d.x, 0.03 );
	d *= 0.6;

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

	outColor.xyz = vec3( 1.0, 0.95, 0.8 );
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;
	
	vec4 n = texture( uNoiseTex, rayPos.xz * 0.5 + vNum.x );

	vec3 yakeCol = vec3( 0.3, 0.1, 0.0 );
	
	outColor.xyz = mix( outColor.xyz, yakeCol, n.x * smoothstep( 0.1, 0.25, rayPos.y ) );

	float dnv = dot( -rayDir, normal );
	outColor.xyz *= mix( outColor.xyz, vec3( 1.0, 0.5, 0.0 ), (1.0 - dnv * dnv) * 0.5 );

	#include <rm_out_pos>	
	#include <frag_out>

}