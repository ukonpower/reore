## Geometry と Material

```glsl
struct Geometry {
	vec3 position; // 頂点座標
	vec3 normal; // 法線
	float depth; // 深度
	vec3 viewDir; // 視線ベクトル
	vec3 viewDirWorld; // 視線ベクトル（ワールド空間)
	float occulusion; // オクルージョン (SSAOから(なんでジオメトリに入ってるのかわからん))
};

struct Material {
	vec3 color; // 色 (Albedo)
	float roughness; // ラフネス
	float metalic; // メタリック
	float emissionIntensity; // 発光の強さ (colorに掛けた値が発光色)
	vec3 diffuseColor; // 拡散色 ( Albedoとマテリアルから計算 )
	vec3 specularColor; // スペキュラ色　( Albedoとマテリアルから計算 )
	float envMapIntensity; // 環境光の影響の強さ
};
```

## GBuffer

```glsl
uniform sampler2D sampler0; // FLOAT          position, depth
uniform sampler2D sampler1; // FLOAT          normal, emissionIntensity
uniform sampler2D sampler2; // UNSIGNED_BYTE  albedo, roughness
uniform sampler2D sampler3; // UNSIGNED_BYTE  ssNormal, null, null, metalic
uniform sampler2D sampler4; // FLOAT          velocity, null, env
```