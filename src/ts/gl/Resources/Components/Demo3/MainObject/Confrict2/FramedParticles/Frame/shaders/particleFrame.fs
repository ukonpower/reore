#include <common>
#include <frag_h>

uniform sampler2D uGBufferNormal;

in vec4 vId;

void main( void ) {

	#include <frag_in>
	
	vec2 uv = gl_FragCoord.xy / uDeferredResolution;

	if( vId.x < 0.5) {

		float r = 32.0 * vId.z;

		uv = floor( uv * r ) / r;
	
	}
	
	vec4 sceneCol = texture( uDeferredTexture, uv);
	vec4 normalCol = texture( uGBufferNormal, uv);

	vec3 col = mix( sceneCol.xyz, normalCol.xyz, step( 0.5, vId.y ) );

	outColor = vec4( col, 1.0 );

	#include <frag_out>

}