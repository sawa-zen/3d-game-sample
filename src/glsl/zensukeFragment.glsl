uniform vec3 lightDirection;
uniform sampler2D map;
uniform sampler2D toonTexture;
uniform vec4 meshColor;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPositon;

void main() {
  // テクスチャカラー
  vec4 tColor = texture2D(map, vUv);

  // 頂点法線とライトの向きベクトルの内積
  float dotValue = dot(vNormal, normalize(lightDirection));
  // 内積値を0~1に収めてX座標を決める
  float toonX = clamp(dotValue, 0.0, 1.0);

  // トゥーンテクスチャの色を取得
  vec4 smpColor = texture2D(toonTexture, vec2(toonX, 1.0));

  // トゥーンテクスチャの色とベーステクスチャの色を乗算
  gl_FragColor = smpColor * tColor;
}
