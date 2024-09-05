#include <common>
#include <packing>
#include <frag_h>

#include <re>

uniform vec3 cameraPosition;
uniform vec2 uResolution;
uniform float uAspectRatio;


void main( void ) {

	#include <frag_in>

	outColor = vec4( 1.0, 1.0, 1.0 , 1.0 );

	#include <frag_out>

} 