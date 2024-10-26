#include <common>
#include <frag_h>

void main( void ) {

	#include <frag_in>

	vec3 c = vec3(1.0);

	outColor = vec4(c, 1.0);
	
	#include <frag_out>

}