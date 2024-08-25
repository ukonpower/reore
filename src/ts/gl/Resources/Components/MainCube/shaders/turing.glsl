uniform sampler2D backBuffer;
uniform vec2 dataSize;
uniform vec4 uTuringParam;
uniform float uTime;
uniform vec2 noiseY;
uniform vec2 noiseX;
uniform vec2 uTuringMask;

varying vec2 vUv;

void main( void ) {

	vec2 d = vec2( 1.0 ) / vec2( dataSize );
	
	vec4 center = texture2D( backBuffer, vUv );
	vec4 top = texture2D( backBuffer, vUv + vec2( 0.0, d.y * uTuringParam.z ) );
	vec4 bottom = texture2D( backBuffer, vUv - vec2( 0.0, d.y * uTuringParam.z ) );
	vec4 left = texture2D( backBuffer, vUv - vec2( d.x * uTuringParam.w, 0.0 ) );
	vec4 right = texture2D( backBuffer, vUv + vec2( d.x * uTuringParam.w, 0.0 ) );

	float dx = 0.02;
	float dt = 1.0;

	vec2 D = vec2( 0.00002, 0.00001 );
	vec2 A = ( top.xy + bottom.xy + left.xy + right.xy - center.xy * 4.0 ) / (dx * dx);
	float B = center.x * center.y * center.y;

	float du = D.x * A.x - B + uTuringParam.x * ( 1.0 - center.x ); 
	float dv = D.y * A.y + B - center.y * ( uTuringParam.x + uTuringParam.y ); 

	float nextU = center.x + du * dt;
	float nextV = center.y + dv * dt;

	float erase = smoothstep( 0.0, 0.4, noise3D( vec3( vUv * ( 0.6 + uTuringMask.x * 1.0), uTuringMask.y * 100.0 ) ) );
	nextU = mix( nextU, 1.0, erase);
	nextV = mix( nextV, 0.0, erase);

	gl_FragColor = vec4( nextU, nextV, 0.0, 0.0 );

}