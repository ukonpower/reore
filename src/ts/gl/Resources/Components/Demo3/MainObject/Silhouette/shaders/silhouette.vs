#include <common>
#include <vert_h>

#ifdef IS_TRAILS

layout(location = 4) in float _rnd;	

out float vRnd;

#endif

void main( void ) {

	#include <vert_in>
	#include <vert_out>

	#ifdef IS_TRAILS
		vRnd = _rnd;
	#endif

}