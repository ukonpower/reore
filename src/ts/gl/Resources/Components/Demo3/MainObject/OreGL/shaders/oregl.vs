#include <common>
#include <vert_h>

#include <noise_simplex>

uniform float uTimeE;

void main( void ) {

	#include <vert_in>

	vec3 pos = outPos;

	float s1 = smoothstep(0.5,1.0,(noiseSimplex(vec3(uTimeE * 0.3,.0,0.0)) + 1.0)/ 2.0);
    float s2 = smoothstep(0.63,1.0,(noiseSimplex(vec3(uTimeE * 0.2 + 1000.0,.0,0.0)) + 1.0)/ 2.0);
    float w1 = (0.96 + cos(uTimeE * 1.0) * 0.04);
    float w2 = 0.0;
    float noise = 0.0;

    if(s1 < 0.01){
      w2 = 1.0;
    }else{
      w2 = (0.95 + sin(noiseSimplex(pos + vec3(.0,.0,-uTimeE * 0.1)) * (2.0 + 5.0 * abs(sin(uTimeE + 100.0))) + -uTimeE * 20.0) * 0.05);
    }

    if(s2 < 0.01){
      noise = 0.0;
    }else{
      noise = (sin(noiseSimplex(pos + vec3(.0,.0,-uTimeE * 0.1)) * 7.0 * sin(uTimeE * 0.3) + -uTimeE * 10.0) + 1.0) / 2.0 * 0.7 * s2;
    }

    float size = mix(1.0,w2,s1) * w1 + noise;
    pos *= size;

	outPos = pos;
	
	#include <vert_out>

}