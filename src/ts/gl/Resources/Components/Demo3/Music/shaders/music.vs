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

vec2 saw( vec2 time ) {

	return vec2( 
		saw( time.x ),
		saw( time.y )
	);
	
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

vec2 ssin( vec2 time ) {

	return vec2( 
		ssin( time.x ),
		ssin( time.y )
	);
	
}

float s2f( float scale ){

	return 440.0 * pow( 1.06, scale );
	
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

vec2 base3( float mt, float ft ) {
	
	vec2 o = vec2( 0.0 );

	vec4 bt = beat( mt / 4.0 , 4.0 );

	float scale = baseLine[ int( bt.x ) % 8 ];

	// scale -= 12.0 * 2.0;

	float et = fract( bt.x );

	for(int i = 0; i < 3; i++){

		// o += base( et, ft, scale + 12.0 * float(  i - 1 ) ) * exp( -(1.0 - et) * 5.0 );

	}
	o *= smoothstep( 0.0, 0.001, et );
	
	return o * 0.05;

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

float lightKick( float et, float ft ) {

	float envTime = fract( et );

	float t = ft;
	t -= 0.05 * exp( -100.0 * envTime );

	float o = sin( t * s2f( 5.0 ) ) * exp( - 20.0 * envTime );
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

vec2 zowaa( float mt, float ft, float pitch, float offset ) {

	vec2 o = vec2( 0.0 );

	mt -= offset * 16.0;

	vec3 ml = getMelody( mt );

	float start = 1.0;

	if( mt < 0.0 ) {

		ml = vec3(
			0.0,
			1.0,
			1.0
		);

		start = exp( -(1.0 - linearstep( -3.75, 0.0, mt )) * 5.0 );

	}

	float envTime = ml.y;
	float env = start;
	env *= smoothstep( 0.0, 0.001, envTime );

	float fft = ft;
	fft += 0.01 * exp( envTime * -8.0 );

	float wave =  ssin( mt * 0.25 ) * 0.5 + 0.5;

	for(int i = 0; i < 3; i++){

		float s = melodyArray[ int( ml.x ) + i ] + pitch - 12.0;

		vec2 v = vec2( 0.0 );

		// for(int j = 0; j < 12; j++){
			
		// 	float w = float( j ) / 12.0;
			
		// 	v += ssin( 
		// 		ft * s2f(  s - 12.0 ) + 
		// 		saw( 
		// 			ft * s2f( s - 12.0 * 1.0 + float( j ) * 12.0 ) + w 
		// 		) * 0.2 + vec2( 0.2, 0.0 ) 
		// 	) * env * start * (0.1 + ( 1.0 - w ) * 0.9);

		// }

		v += ( ssin( ft * s2f(s) + vec2( 0.5, 0.0 )  ) + ssin( ft * s2f(s) * 1.004 + vec2( 0.0, 0.1 ) ) ) * 0.5;
		// v += base( envTime, ft, s + 12.0 );

		o += v * 0.15;
			
	}

	// o *= tanh( sin( easeIn(start, 2.5) * (PI * 5.0 + PI / 2.0) ) * 2.0 ) * 0.8;
	o *= start;
	o *= smoothstep( 0.0, 1.5, envTime );

	return o;

}

/*-------------------------------
	Shuwaa
-------------------------------*/

vec2 shuwaa( float mt, float ft ) {

	vec2 o = vec2( 0.0 );
	vec4 b = beat( mt, 16.0 );

	vec2 v = vec2( 0.0 );

	float env = b.z;
	float ft_ = linearstep(0.3, 1.0, env ) * 1.0;

	float noise = ((noiseV( ft_ * 5500.0 * env) - 0.5) * 1.8 ) * 0.1 * exp(-6.*smoothstep( 1.0,0.3,env)) * smoothstep(1.0,.99,env);
    v += noise;

	o += v;

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
	Howahowa
-------------------------------*/

const float howahowaArray[] = float[] (
	-9.0, -6.0, -2.0, 1.0, 5.0, 8.0, 10.0, 13.0, 15.0, 17.0
);

float howahowa( float et, float ft, float s ) {

	float o = 0.0;

	float v = ssin( ft * s2f( s ) ) * 0.1;
	v *= smoothstep( 0.0, 1.0, et );
	v *= smoothstep( 1.0, 0.99, et );

	o += v;

	return o;

}

vec2 howahowa1( float mt, float ft, float pitch ) {

	vec2 o = vec2( 0.0 );

	vec4 b4 = beat( mt, 4.0 );
	vec4 b14 = beat( mt * 4.0, 8.0 );

	int index = int( floor( b14.x + 2.0 ) );

	float s = howahowaArray[ index ];

	float v = howahowa( fract( b14.x ), ft, s + pitch );
	o += v * 0.8;

	float rd = mt * 0.5;

	o.x *= ssin( rd );
	o.y *= ssin( rd + PI );

	return o;

}

vec2 howahowa2( float mt, float ft, float pitch ) {

	vec2 o = vec2( 0.0 );

	vec4 b4 = beat( mt, 4.0 );
	vec4 b14 = beat( mt * 4.0, 8.0 );

	int index = int( floor( b14.x + abs( 2.0 - mod(b4.y, 4.0) ) ) );

	float s = howahowaArray[ index ];

	float v = howahowa( fract( b14.x ), ft, s + pitch );

	o += v * 0.8;

	float rd = mt * 0.5;
	o.x *= ssin( rd );
	o.y *= ssin( rd + PI );

	return o;

}

vec2 howahowa3 ( float mt, float ft, float pitch ) {

	vec2 o = vec2( 0.0 );

	vec4 b4 = beat( mt, 4.0 );
	vec4 b14 = beat( mt * 4.0, 8.0 );

	int index = int( mod( floor( mt * 4.0 ) * 3.0 + 8.0, 8.0 ) +  abs( 2.0 - mod(b4.y, 4.0) ) );

	float s = howahowaArray[ index ];

	float v = howahowa( fract( b14.x ), ft, s + pitch );

	o += v * 0.8;

	float rd = mt * 0.5;
	o.x *= ssin( rd );
	o.y *= ssin( rd + PI );

	return o;

}

float getFrec( float t, float m, vec4 b8 ) {
	
	return t - ( m * 16.0 + max( 0.0, b8.y - m * 2.0 ) * 8.0 ) * ( 60.0 / uBPM ) ;

}

/*-------------------------------
	Music
-------------------------------*/

vec2 music( float t ) {

	float mt = t * (uBPM / 60.0);
	mt = max( 0.0, mt - 4.0 );

	vec2 o = vec2( 0.0 );

	vec4 beat4 = beat( mt, 4.0 );
	vec4 beat8 = beat( mt, 8.0 );
	vec4 beat16 = beat( mt, 16.0 );

	// click
	
	// o += step( fract( beat4.x ), 0.1 ) * ssin( t * s2f(3.0) * 2.0 ) * 0.03;
	// o += step( fract( beat4.x / 4.0 ), 0.05 ) * ssin( t * s2f(12.0) * 2.0 ) * 0.02;

	if( isin( beat16.y, 0.0, 2.0 ) ) {

		t = getFrec( t, 0.0, beat8 );

		o += kick1( mt, t );
		o += snare1( mt, t ); 
		o += howahowa1( mt, t, 0.0 ) * step( beat16.w, 1.878 );
	}

	if( isin( beat16.y, 2.0, 6.0 ) ) {

		t = getFrec( t, 2.0, beat8 );

		o += base1( mt, t );
		o += kick1( mt, t );
		o += snare2( mt, t );
		o += xylophone( mt, t, 0.0 );
		o += howahowa2( mt, t, 0.0 ) * 0.7;

		if( isin( beat16.w, 3.75, 6.0 ) ) {

			// o += base3( mt, t );

			// o += zowaa(mt, t, 3.0, 8.0 ) * 0.7;
			o += zowaa( mt, t, 0.0, 4.0 )  * 0.75;

			
		}

	}

	if( isin( beat16.y, 6.0, 8.0 ) ) {

		t = getFrec( t, 6.0, beat8 );

		o += base2( mt, t );
		o += snare3( mt, t );
		o += kick1( mt, t );

	}

	if( isin( beat16.y, 8.0, 9.0 ) ) {

		t = getFrec( t, 8.0, beat8 );

		o += xylophone( mt, t, 0.0 );
	
	}

	if( isin( beat16.y, 9.0, 12.0 ) ) {

		t = getFrec( t, 9.0, beat8 );

		float mt_ = mt;
		mt_ -= 16.0;
		
		o += base1( mt, t );
		o += kick1( mt, t );
		o += snare2( mt, t );
		o += xylophone(mt_, t, 3.0 );
		o += howahowa3( mt_, t, 3.0 ) * 0.7;
		o += zowaa(mt_, t, 3.0, 8.0 ) * 0.7;

	}

	if( isin( beat16.y, 12.0, 13.0 ) ) {

		t = getFrec( t, 12.0, beat8 );

		o += base1( mt, t );  
		o += kick1( mt, t );
		o += snare1( mt, t );
		o += xylophone( mt, t, 0.0 );
		o += howahowa3( mt, t, 0.0 ) * 0.7;

	}

	if( isin( beat16.y, 13.0, 14.0 ) ) {
		
		t = getFrec( t, 13.0, beat8 );
		
		o += kick1( mt, t );
		o += snare1( mt, t );
		o += xylophone( mt, t, 0.0 );

	}

	// o += shuwaa( mt, t );

	return o;
	
}

void main( void ) {

	float time = (aTime / uSampleRate ) + uTimeOffset;

	vec2 o = music( time );

	o_left = o.x;
	o_right = o.y;

}