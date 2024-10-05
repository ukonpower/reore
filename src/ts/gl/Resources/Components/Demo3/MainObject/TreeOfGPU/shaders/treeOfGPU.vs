#include <common>
#include <vert_h>

layout(location = 3) in vec3 instancePos;

#ifdef IS_PASS

	layout (location = 4) in float instanceLength;
	layout (location = 5) in float instanceRot; 

#endif

#include <rotate>

void main( void ) {

	#include <vert_in>


	#ifdef IS_SEFIROT

	
	#endif

	#ifdef IS_PASS

		outPos.x *= ( instanceLength );
		outPos.x += 0.5;
		outPos.x *= (instanceLength);
		outPos.xy *= rotate( -instanceRot );
	
	#endif
	
	outPos.xyz += instancePos;

	#include <vert_out>

}