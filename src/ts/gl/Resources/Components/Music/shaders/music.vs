#include <common>

#include <noise>

in float aTime;

out float o_left;
out float o_right;

uniform float uDuration;
uniform float uSampleRate;
uniform float uTimeOffset;

uniform float uBPM;

/*-------------------------------
	Utils
-------------------------------*/

float whiteNoise(float time)
{
    return fract(sin(dot(vec2( time ), vec2(12.9898,78.233))) * 43758.5453);
}


float saw(float time){

    return fract(-time)*2.-1.;
	
}

float square( float time) {

	return sign( fract( time ) - 0.1 );
	
}

float tri(float time ){
    return abs(2.*fract(time*.5-.25)-1.)*2.-1.;
}

float ssin(float time ) {
	return sin( time * TPI );
}

float s2f( float scale ){

	return 440.0 * pow( 1.06, scale );
	
}

float slope( float value, float slope ) {

	if( value >= 0.0 ) {

		return linearstep( 0.0, 1.0 - slope, value );

	} else {

		return linearstep( 0.0, -1.0 + slope, value ) * -1.0;
		
	}

	return 0.0;
	
}

bool isin( float time, float start, float end ) {

	return start <= time && time <= end;
	
}

vec3 beat( float time, float beat ) {

	float x = mod( time, beat );
	float y = x  / beat;
	float z = floor( beat );

	return vec3( x, y, z );
	
}

/*-------------------------------
	Base
-------------------------------*/

vec2 base( float mt, float ft ) {

	vec2 o = vec2( 0.0 );

	float envTime = fract(mt) ;
	
	o += sin( ft * s2f(0.0) );

	o *= 0.7;
	
	return o;

}

vec2 base1( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec3 bt = beat( mt, 4.0 );

	o += base( bt.y, ft );
	
	return o * 0.8;

}

/*-------------------------------
	Snare
-------------------------------*/

float snare( float mt, float ft ) {

	float envTime = fract(mt) ;

	float o = 0.0;
	
	float et = envTime;
	float env = exp( -120.0 * envTime ) ;

	float t = ft;
	t -= 0.1 * exp( -70.0 * envTime );
	
	o += ( fbm( t * 1400.0 ) - 0.5 ) * env * 2.0;

	
	return o;

}

vec2 snare1( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec3 bt = beat( mt, 4.0 );

	o += snare( bt.y - 0.725, fract( ft ) );
	
	return o * 0.8;

}

/*-------------------------------
	Hihat
-------------------------------*/

float hihat( float mt, float ft ) {

	return noise(ft * 22000.0) * max(0.0,1.0-min(0.85,mt*4.25)-(mt-0.25)*0.3);

}

vec2 hihat1( float mt, float ft ) {
	
	vec2 o = vec2( 0.0 );

	o += hihat( mt, ft  * 0.01);

	o *= 0.04;
	
	return o;
  
}

/*-------------------------------
	Kick
-------------------------------*/

float kick( float t, float ft ) {

	float envTime = fract( t );

	float t = ft;
	t -= 0.1 * exp( -70.0 * envTime );
	t += 0.1;

	float o = ( smoothstep( -0.5, 0.5, sin( t * 190.0 ) ) * 2.0 - 1.0 ) * smoothstep( 1.0, 0.1, envTime );
	o *= 0.25;

    return o;

}

float lightKick( float mt, float ft ) {

	float envTime = fract( mt );

	float t = ft;
	t -= 0.05 * exp( -100.0 * envTime );

	float o = ( slope( sin( t * s2f( 5.0 ) ), 0.0 ) ) * exp( - 20.0 * envTime );
	o *= smoothstep( 0.0, 0.0005, envTime);
	o *= 0.3;

    return o;

}

vec2 kick1( float mt, float ft ) {

	vec2 o = vec2( 0.0 );

	vec3 b4 = beat( mt, 4.0 );
	vec3 b8 = beat( mt, 8.0 );

	for(int i = 0; i < 3; i++){
		
		float l = b4.y - float(i) / ( 16.0 / 3.0 );

		if( i != 2 || b8.y > 0.5 ) {

			o += lightKick( l, ft );

		}
		
	}

	return o;

}


vec2 music( float t ) {

	float mt = t * (uBPM / 60.0);
	mt = max( 0.0, mt - 0.0 );

	vec2 o = vec2( 0.0 );

	// click
	
	vec3 beat4 = beat( mt, 4.0 );

	// o += step( fract( beat4.x ), 0.1 ) * ssin( t * s2f(3.0) * 2.0 ) * 0.03;
	// o += step( fract( beat4.x / 4.0 ), 0.05 ) * ssin( t * s2f(12.0) * 2.0 ) * 0.02;

	// kick

	o += kick1( mt, t );

	// snare

	o += snare1( mt, t ); 

	// base

	o += base( mt, t );

	return o;
	
}

void main( void ) {

	float time = (aTime / uSampleRate ) + uTimeOffset;

	vec2 o = music( time );

	o_left = o.x;
	o_right = o.y;

}