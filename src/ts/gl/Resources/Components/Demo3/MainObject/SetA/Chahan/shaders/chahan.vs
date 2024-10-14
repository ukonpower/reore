#include <common>
#include <vert_h>
#include <rotate>

#if defined( PARA ) || defined( SHOGA )
	layout (location = 3) in vec4 rnd;
#endif


#ifdef NIKU
	layout (location = 4) in float posY;
#endif

uniform sampler2D uNoiseTex;

void main( void ) {

	#include <vert_in>

	#ifdef PARA

		#ifdef KOME

			outPos.x += cos( outPos.y * 20.0 ) * 0.01;
			outPos.y *= 3.0;
			outPos *= 0.3;

		#endif

		#ifdef NEGI

			outPos.yz *= rotate( PI / 2.0 * rnd.z * 0.5 );

		#endif

		#ifdef NIKU

			// outPos.x += sin( outPos.y * 100.0 ) * 0.005;
			outPos.xz *= rotate( posY * 0.3 );
			outNormal = normalize( outNormal + texture( uNoiseTex, uv.xy * 1.0 ).xyz * 2.0 );
		
		#endif

		// https://qiita.com/aa_debdeb/items/e416ae8a018692fc07eb

		float cosTheta = -2.0 * rnd.x + 1.0;
		float sinTheta = sqrt(1.0 - cosTheta * cosTheta);
		float phi = 1.0 * PI * rnd.y;
		vec3 o = vec3( sinTheta * cos(phi), sinTheta * sin(phi), cosTheta );
		o *= ( 0.6 );

		mat2 r = rotate( rnd.w * TPI );
		outPos.xy *= r;
		outNormal.xy *= r;

		mat3 rot = makeRotationDir( normalize( o ), vec3( 0.0, 1.0, 0.0 ) );
		outPos *= rot;
		outNormal *= rot;
		
		outPos += o;

	#endif

	#ifdef DUMMY

		outPos *= 1.0 + ( texture( uNoiseTex, uv.xy * 1.0 ).xyz - 0.5 ) * 0.1;
		outPos *= step( -0.05, outPos.y );
	
	#endif

	#ifdef SHOGA

		outPos.x += cos( outPos.z * 10.0 + rnd.w ) * 0.01;

		outPos.z *= sin(rnd.w * 10.0) * 0.2 + 1.0;
		outPos.z += outPos.x;

		mat2 r = rotate( rnd.w * TPI );
		outPos.xy *= r;
		outNormal.xy *= r;

		outPos.xyz += (rnd.xyz - 0.5) * 0.08;
		outPos.y += 0.04;
	
	#endif
	
	#include <vert_out>
	
}