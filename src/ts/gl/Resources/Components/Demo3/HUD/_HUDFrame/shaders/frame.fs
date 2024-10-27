#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	vec3 c = vec3(1.0);

	outColor = vec4(c, smoothstep( 0.5, 0.0, abs(vUv.y - 0.5 ) ) );
	
	#include <frag_out>

}