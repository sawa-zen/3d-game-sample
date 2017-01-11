uniform vec3 lightDirection;
uniform sampler2D map;
uniform sampler2D toonTexture;
uniform vec4 meshColor;
varying vec3 vNormal;
varying vec2 vUv;
void main() {
  vec4 tColor;
  tColor = texture2D(map, vUv);
  float diffuse = clamp(dot(vNormal, normalize(lightDirection)), 0.0, 1.0);
  vec4 smpColor = texture2D(toonTexture, vec2(diffuse, 0.0));
  gl_FragColor = meshColor * smpColor * tColor;
}
