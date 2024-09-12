#include <common>
#include <frag_h>

layout (location = 0) out vec4 outColor;

uniform float uTimeE;

void main( void ) {

	outColor = vec4( sin( vUv.x * 10.0 + uTimeE ) );

}