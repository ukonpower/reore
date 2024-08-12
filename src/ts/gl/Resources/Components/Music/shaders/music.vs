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

	return start <= time && time < end;
	
}

vec4 beat( float time, float beat ) {

	float b = mod( time, beat );

	return vec4( 
		b, 
		floor( time / beat ),
		b / beat,
		0.0
	);
	
}

/*-------------------------------
	Base
-------------------------------*/

vec2 base( float et, float ft, float scale ) {

	vec2 o = vec2( 0.0 );

	for(float i = 0.0; i < 2.0; i++){

		o += slope( ssin( ft * s2f( scale - 12.0 + 12.0 * i ) + float( i ) * 0.1 ), 0.3 - i * 0.3 );

	}

	o *= 0.4;
	
	return o;

}

const float baseLine[] = float[](
	10.0, 6.0, 3.0, 5.0, 10.0, 6.0, 3.0, 5.0
);


vec2 base1( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec4 bt = beat( mt / 4.0 , 4.0 );

	float scale = baseLine[ int( bt.x ) % 8 ];

	scale -= 12.0 * 2.0;

	float et = fract( bt.x );

	o += base( et, ft, scale ) * smoothstep( 0.95, 0.75, et );
	o *= smoothstep( 0.0, 0.001, et );
	
	return o * 0.25;

}

/*-------------------------------
	Snare
-------------------------------*/

float snare( float et, float ft, float etw ) {

	float o = 0.0;

	et = fract( et );

	float t = ft;
	t -= 0.2 * exp( -0.0 * et * etw );
	
	o += ( fbm( t * 2900.0 ) - 0.5 ) * exp( -200.0 * et * etw ) * 2.0;

	o *= 0.7;
	
	return o;

}


vec2 snare1( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec4 bt = beat( mt, 8.0 );

	o += snare( bt.z - (1.0 - 0.125), fract( ft ), 1.0 );
	
	return o * 0.8;

}

vec2 snare2( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec4 bt = beat( mt, 2.0 );

	o += snare( bt.z - (0.5), fract( ft ), 0.25 );
	
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

float lightKick( float et, float ft ) {

	float envTime = fract( et );

	float t = ft;
	t -= 0.05 * exp( -100.0 * envTime );

	float o = ( slope( sin( t * s2f( 5.0 ) ), 0.0 ) ) * exp( - 20.0 * envTime );
	o *= smoothstep( 0.0, 0.0005, envTime);
	o *= 0.3;

    return o;

}

vec2 kick1( float mt, float ft ) {

	vec2 o = vec2( 0.0 );

	vec4 b4 = beat( mt, 4.0 );
	vec4 b8 = beat( mt, 8.0 );

	for(int i = 0; i < 3; i++){
		
		float l = b4.z - float(i) / ( 16.0 / 3.0 );

		if( i != 2 || b8.z > 0.5 ) {

			o += lightKick( l, ft );

		}
		
	}

	return o;

}


/*-------------------------------
	xylophone
-------------------------------*/

const float xylophoneMelody[] = float[](
	1.0, 10.0, 13.0,
	3.0, 8.0, 12.0,
	5.0, 10.0, 13.0,

	5.0, 10.0, 13.0,
	3.0, 12.0, 15.0,
	1.0, 10.0, 13.0,

	1.0, 8.0, 12.0,

	

	1.0, 10.0, 13.0,
	3.0, 8.0, 12.0,
	5.0, 10.0, 13.0,

	5.0, 10.0, 13.0,
	3.0, 12.0, 15.0,
	1.0, 10.0, 13.0,

	5.0, 10.0, 13.0
);

vec2 xylophone1( float mt, float ft ) {

	vec2 o = vec2( 0.0 );

	float ph = floor( mod( mt, 8.0 ) / 4.0 );
	ph = 0.0;

	mt = mod(mt, 4.0) / (4.0 / ( 16.0 / 3.0 ));

	vec4 b4 = beat( mt, 6.0 );

	float envTime = fract( b4.x );

	float sb = floor( b4.x ) * 3.0 + ph * 18.0;

	float w =  smoothstep( 1.0, 0.1, envTime );

	float t = ft;
	t -= 0.02 * exp( -100.0 * envTime );
	t += 0.02;

	for(int i = 0; i < 3; i++){

		float s = xylophoneMelody[ int( sb ) + i ] - 12.0;

		float v = ( smoothstep( -0.5, 0.5, ssin( t * s2f( s ) ) ) * 2.0 - 1.0 ) * w;

		o += v * 0.03;// * ( 1.0 - fi * 1.5 );
		
	}

	return o;

}


vec2 music( float t ) {

	float mt = t * (uBPM / 60.0);
	mt = max( 0.0, mt - 0.0 );

	vec2 o = vec2( 0.0 );

	vec4 beat4 = beat( mt, 4.0 );
	vec4 beat16 = beat( mt, 16.0 );

	// click
	
	o += step( fract( beat4.x ), 0.1 ) * ssin( t * s2f(3.0) * 2.0 ) * 0.03;
	o += step( fract( beat4.x / 4.0 ), 0.05 ) * ssin( t * s2f(12.0) * 2.0 ) * 0.02;


	if( isin( beat16.y, 0.0, 2.0 ) ) {

		o += kick1( mt, t );

		o += snare1( mt, t ); 

	}

	if( isin( beat16.y, 2.0, 4.0 ) ) {

		o += kick1( mt, t );
		o += snare2( mt, t );

		o += xylophone1( mt, t );

	}

	o += base1( mt, t );


	return o;
	
}

void main( void ) {

	float time = (aTime / uSampleRate ) + uTimeOffset;

	vec2 o = music( time );

	o_left = o.x;
	o_right = o.y;

}