#include <common>
#include <vert_h>
#include <random>
#include <rotate>

#if defined( NEGI ) || defined( MENMA ) || defined( CHASHU ) || defined( NORI )
	layout (location = 3) in vec4 rnd;
#endif

#ifdef NIKU
	layout (location = 4) in float posY;
#endif

uniform sampler2D uNoiseTex;
uniform vec4 uState;

void main( void ) {

	#include <vert_in>

	vec4 n = texture( uNoiseTex, uv * 1.0 );

	#ifdef TAMAGO

	outPos *= vec3( 1.0, 1.3, 1.0 );
	
	#endif
	
	#ifdef NEGI

		outPos.x += cos( outPos.z * 10.0 + rnd.w ) * 0.01;
		outPos.z *= sin(rnd.w * 10.0) * 0.2 + 1.0;

		mat2 r = rotate( rnd.w * TPI );
		outPos.xy *= r;
		outNormal.xy *= r;

		outPos.xyz += (rnd.xyz - 0.5) * 0.15 * vec3( 2.0, 0.2, 2.0 );
		outPos.y += 0.04;
	
	#endif

	#ifdef MENMA

		mat2 r = rotate( PI / 2.0 );
		outPos.yz *= r;
		outNormal.yz *= r;

		r = rotate( outPos.z * 1.0 );
		outPos.xy *= r;
		outNormal.xy *= r;

		outPos.x += cos( outPos.z * 10.0 + rnd.w * 10.0 ) * 0.01;

		float x = (rnd.x - 0.5);
		r = rotate( x * 0.4);

		outPos.z *= rnd.z * 0.3 + 0.8;
		outPos.xz *= r;
		outNormal.xz *= r;
		outPos.x += x * 0.3;
		outPos.y += ( rnd.y - 0.5 ) * 0.05;
	
	#endif

	#ifdef CHASHU

		float x = (rnd.x - 0.5);

		outPos.y += -outPos.z * 0.2;

		mat2 r;

		r = rotate( x * -0.3 );
		outPos.xy *= r;
		outNormal.xy *= r;
		
		outPos.z += abs(x) * 0.1;
		outPos.x += x * 0.5;
		outPos.y += rnd.x * 0.03;

		r = rotate( -0.1 );
		outPos.yz *= r;
		outNormal.yz *= r;

	
	#endif

	#ifdef NORI

		float x = (rnd.x - 0.5);

		outPos.z += ( n.x - 0.5 ) * 0.01;
		outPos.y += -outPos.z * 0.2;

		mat2 r;
		r = rotate( 0.6 );
		outPos.yz *= r;
		outNormal.yz *= r;
		
		outPos.z -= abs(x) * 0.05;

		r = rotate( x * -0.9 );
		outPos.xz *= r;
		outNormal.xz *= r;

		outPos.x += x * 0.45;

	#endif
	
	#include <vert_out>

}