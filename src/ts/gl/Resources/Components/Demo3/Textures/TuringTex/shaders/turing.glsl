#include <common>

uniform sampler2D uGPUSampler0;
uniform vec2 uGPUResolution;
uniform vec4 uTuringParam;

in vec2 vUv;

layout (location = 0) out vec4 outColor;

void main( void ) {

	vec2 d = vec2( 1.0 ) / vec2( uGPUResolution );
	
	vec4 center = texture( uGPUSampler0, vUv );
	vec4 top = texture( uGPUSampler0, vUv + vec2( 0.0, d.y * uTuringParam.z ) );
	vec4 bottom = texture( uGPUSampler0, vUv - vec2( 0.0, d.y * uTuringParam.z ) );
	vec4 left = texture( uGPUSampler0, vUv - vec2( d.x * uTuringParam.w, 0.0 ) );
	vec4 right = texture( uGPUSampler0, vUv + vec2( d.x * uTuringParam.w, 0.0 ) );

	float dx = 0.02;
	float dt = 1.0;

	vec2 D = vec2( 0.00002, 0.00001 );
	vec2 A = ( top.xy + bottom.xy + left.xy + right.xy - center.xy * 4.0 ) / (dx * dx);
	float B = center.x * center.y * center.y;

	float du = D.x * A.x - B + uTuringParam.x * ( 1.0 - center.x ); 
	float dv = D.y * A.y + B - center.y * ( uTuringParam.x + uTuringParam.y ); 

	float nextU = center.x + du * dt;
	float nextV = center.y + dv * dt;

	outColor = vec4( nextU, nextV, 0.0, 0.0 );

}