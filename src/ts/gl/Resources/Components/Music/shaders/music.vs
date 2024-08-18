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
		time / beat
	);
	
}

/*-------------------------------
	Base
-------------------------------*/

vec2 base( float et, float ft, float scale ) {

	vec2 o = vec2( 0.0 );

	scale -= 12.0;

	for(float i = 0.0; i < 2.0; i++){

		float v = ssin( ft * s2f( scale - 0.0 ) );
		v =  tanh( ssin( ft * s2f( scale - 12.0 ) + v * 0.1 + float( i ) * 0.1 ) * 1.0 * 1.15 );

		o += v;
 
	}

	// o *= 1.1;
	
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
	
	return o * 0.20;

}

vec2 base2( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec4 bt = beat( mt , 8.0 );

	float scale = 10.0;

	scale -= 12.0 * 2.0;

	float et = fract( bt.z ) * 2.0;

	o += base( et, ft, scale ) * smoothstep( 0.95, 0.75, et );
	o *= smoothstep( 0.0, 0.001, et );
	
	return o * 0.20;

}

/*-------------------------------
	Snare
-------------------------------*/

float snare( float et, float ft, float etw ) {

	float o = 0.0;

	et = fract( et );

	float t = ft;
	
	o += ( fbm( t * 3200.0 ) - 0.5 ) * exp( -150.0 * et * etw );

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

vec2 snare3( float mt, float ft ) { 

	vec2 o = vec2( 0.0 );

	vec4 bt = beat( mt, 4.0 );

	o += snare( bt.z - (0.725), fract( ft ), 0.5 );
	
	return o * 0.8;

}

/*-------------------------------
	Kick
-------------------------------*/

float kick( float t, float ft ) {

	float envTime = fract( t );

	ft -= 0.1 * exp( -70.0 * envTime );
	ft += 0.1;

	float o = ( smoothstep( -0.5, 0.5, sin( ft * 190.0 ) ) * 2.0 - 1.0 ) * smoothstep( 1.0, 0.1, envTime );
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
	Melody
-------------------------------*/

const float melodyArray[] = float[](
	1.0, 10.0, 13.0,
	3.0, 8.0, 12.0,
	5.0, 10.0, 13.0,

	5.0, 10.0, 13.0,
	3.0, 12.0, 15.0,
	1.0, 10.0, 13.0,

	1.0, 8.0, 12.0,
	3.0, 12.0, 15.0
);

vec3 getMelody( float mt ) {

	float ph = floor( mod( mt, 8.0 ) / 4.0 );

	vec4 b16 = beat( mt, 16.0 );
	vec4 b4 = beat( mt, 4.0 );
	vec4 b6 = beat( mod(mt, 4.0) / (4.0 / ( 16.0 / 3.0 )), 6.0 );

	float envScale = 1.0;
	float envTime = fract( b6.x );

	float scaleIndex = floor( b6.x ) * 3.0 + ph * 9.0;

	if( b6.x > 2.0 ) {

		scaleIndex = (mod( b4.y, 2.0 ) == 0.0) ? 2.0 * 3.0 : 5.0 * 3.0; 
		envTime = b6.x - 2.0;
		envScale = 2.0;

	}

	if( mod(b4.y, 4.0) >= 3.0 ) {

		scaleIndex = mod( b16.y, 2.0 ) == 0.0 ? 6.0 * 3.0 : 7.0 * 3.0;
		envScale = 4.0;
		envTime = b4.x;
		
	}

	float env = exp( envTime * -0.4 );
	env *= smoothstep( 0.0, 0.001, envTime );

	return vec3(
		scaleIndex,
		envTime,
		envScale
	);
	
}

/*-------------------------------
	zowaa
-------------------------------*/

vec2 zowaa( float mt, float ft, float pitch ) {

	vec2 o = vec2( 0.0 );

	vec3 ml = getMelody( mt );
	
	float envTime = ml.y;
	float env = 1.0; //smoothstep( ml.z, 0.9, envTime );
	env *= smoothstep( 0.0, 0.001, envTime );

	for(int i = 0; i < 3; i++){

		float s = melodyArray[ int( ml.x ) + i ] - 12.0 * 1.0 + pitch;

		float v = 0.0;
		v = saw( ft * s2f( s - 12.0 ) ) * env;

		o += v * 0.05;
			
	}

	return o;

}

/*-------------------------------
	xylophone
-------------------------------*/

vec2 xylophone( float mt, float ft, float pitch ) {

	vec2 o = vec2( 0.0 );

	vec4 b6 = beat( mod(mt, 4.0) / (4.0 / ( 16.0 / 3.0 )), 6.0 );

	vec3 ml = getMelody( mt );
	
	ft -= 0.005 * exp( -70.0 * ml.y );
	
	float envTime = ml.y;
	float env = exp( envTime * -0.4 );
	env *= smoothstep( 0.0, 0.001, envTime );

	for(int i = 0; i < 3; i++){

		float s = melodyArray[ int( ml.x ) + i ] - 12.0 * 2.0 + pitch;

		for(int j = 0; j < 4; j++){
			
			float v = 0.0;
		
			v = ssin( ft * s2f( s - 12.0 ) + float(j) / 4.0 * 0.5 ) * env;
			
			v += ( 
				ssin( ft * s2f( s ) + v * 0.25 + float(j) / 4.0 * PI ) * 
				( 
					1.0 +
					ssin( b6.x * 1.0 ) * 0.4 +
					exp( envTime * -10.0) * 5.0 
				)
			) * env;

			v *= float( i ) * 0.7 + 0.3;

			o += v * 0.015 * 0.6;

		}
			
	}

	return o;

}

/*-------------------------------
	Music
-------------------------------*/

vec2 music( float t ) {

	float mt = t * (uBPM / 60.0);
	mt = max( 0.0, mt - 4.0 );

	vec2 o = vec2( 0.0 );

	vec4 beat4 = beat( mt, 4.0 );
	vec4 beat16 = beat( mt, 16.0 );

	// click
	
	// o += step( fract( beat4.x ), 0.1 ) * ssin( t * s2f(3.0) * 2.0 ) * 0.03;
	// o += step( fract( beat4.x / 4.0 ), 0.05 ) * ssin( t * s2f(12.0) * 2.0 ) * 0.02;


	if( isin( beat16.y, 0.0, 2.0 ) ) {

		// o += base1( mt, t );
		o += kick1( mt, t );
		o += snare1( mt, t ); 

	}

	if( isin( beat16.y, 2.0, 6.0 ) ) {

		o += base1( mt, t );
		o += kick1( mt, t );
		o += snare2( mt, t );
		o += xylophone( mt, t, 0.0 );

		if( isin( beat16.y, 4.0, 6.0 ) ) {

			o += zowaa( mt, t, 0.0 )  * 0.75;
			
		}

	}

	if( isin( beat16.y, 6.0, 8.0 ) ) {

		o += base2( mt, t );
		o += snare3( mt, t );
		o += kick1( mt, t );

	}

	if( isin( beat16.y, 8.0, 9.0 ) ) {

		o += xylophone( mt, t, 0.0 );
	
		
	}

	if( isin( beat16.y, 9.0, 12.0 ) ) {

		float mt_ = mt;

		if( isin( beat16.y, 9.0, 10.0 ) ) {

			mt_ -= 16.0;

		}
		
		o += base1( mt, t );
		o += kick1( mt, t );
		o += snare2( mt, t );
		o += xylophone(mt_, t, 3.0 );
		o += zowaa(mt_, t, 3.0 ) * 0.7;

	}

	if( isin( beat16.y, 12.0, 13.0 ) ) {

		o += base1( mt, t );  
		o += kick1( mt, t );
		o += snare1( mt, t );
		o += xylophone( mt, t, 0.0 );

	}

	if( isin( beat16.y, 13.0, 14.0 ) ) {
		
		o += kick1( mt, t );
		o += snare1( mt, t );
		o += xylophone( mt, t, 0.0 );

	}



	return o;
	
}

void main( void ) {

	float time = (aTime / uSampleRate ) + uTimeOffset;

	vec2 o = music( time );

	o_left = o.x;
	o_right = o.y;

}