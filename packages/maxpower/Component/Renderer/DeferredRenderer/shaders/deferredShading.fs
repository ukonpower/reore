#include <common>
#include <packing>
#include <light>
#include <pmrem>

// uniforms

uniform sampler2D sampler0; // position, depth
uniform sampler2D sampler1; // normal, emissionIntensity
uniform sampler2D sampler2; // albedo, roughness
uniform sampler2D sampler3; // ssNormal, null, null, metalic
uniform sampler2D sampler4; // velocity, env

uniform sampler2D uSSAOTexture;
uniform sampler2D uLightShaftTexture;
uniform sampler2D uEnvMap;

uniform vec3 uColor;
uniform mat4 viewMatrix;
uniform mat4 cameraMatrix;
uniform vec3 cameraPosition;
uniform vec2 uPPPixelSize;

// varyings

in vec2 vUv;

// out

layout (location = 0) out vec4 glFragOut0;
layout (location = 1) out vec4 glFragOut1;

// struct Geometry {
// 	vec3 position;
// 	vec3 normal;
// 	float depth;
// 	vec3 viewDir;
// 	vec3 viewDirWorld;
// 	float occulusion;
// };

// struct Material {
// 	vec3 color;
// 	float roughness;
// 	float metalic;
// 	float emissionIntensity;
// 	vec3 diffuseColor;
// 	vec3 specularColor;
// };

/*-------------------------------
	Custom
-------------------------------*/

uniform sampler2D uSideTex;

void main( void ) {

	//[
	vec4 tex0 = texture( sampler0, vUv );
	vec4 tex1 = texture( sampler1, vUv );
	vec4 tex2 = texture( sampler2, vUv );
	vec4 tex3 = texture( sampler3, vUv );
	vec4 tex4 = texture( sampler4, vUv );

	float occlusion = texture( uSSAOTexture, vUv ).x * 0.4;
	vec3 right = texture( sampler0, vUv + vec2( uPPPixelSize.x, 0.0 ) ).xyz;
	vec3 top = texture( sampler0, vUv + vec2( 0.0, uPPPixelSize.y ) ).xyz;
	vec3 left = texture( sampler0, vUv + vec2( -uPPPixelSize.x, 0.0 ) ).xyz;
	vec3 bottom = texture( sampler0, vUv + vec2( 0.0, -uPPPixelSize.y ) ).xyz;
	vec3 dx1 = right - tex0.xyz;
    vec3 dy1 = top - tex0.xyz;
	vec3 dx2 = -(left - tex0.xyz);
    vec3 dy2 = -(bottom - tex0.xyz);

	vec3 calcNormal = normalize(cross(
		length(dx1) < length(dx2) ? dx1 : dx2,
		length(dy1) < length(dy2) ? dy1 : dy2
	));

	vec3 normal = mix( tex1.xyz, calcNormal, tex3.x );

	Geometry geo = Geometry(
		tex0.xyz,
		normal,
		0.0,
		normalize( cameraPosition - tex0.xyz ),
		vec3( 0.0 ),
		occlusion
	);
	
	Material mat = Material(
		tex2.xyz,
		tex2.w,
		tex3.w,
		tex1.w,
		mix( tex2.xyz, vec3( 0.0, 0.0, 0.0 ), tex3.w ),
		mix( vec3( 1.0, 1.0, 1.0 ), tex2.xyz, tex3.w ),
		tex4.w
	);
	vec3 outColor = vec3( 0.0 );
	//]
	
	// lighting

	#include <lighting_light>

	// env

	#include <lighting_env>
	
	// light shaft
	
	outColor.xyz += texture( uLightShaftTexture, vUv ).xyz;

	glFragOut0 = glFragOut1 = vec4( outColor, 1.0 );

}