import * as THREE from 'three';
import Loader from '../../loader/Loader';

/**
 * 海クラス
 */
export default class Sea extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // Geometry
    let geometry = new THREE.PlaneGeometry(500, 500, 10, 10);

    var vertexShader = `
#define SCALE 20.0

varying vec2 vUv;
varying float fogDepth;

uniform float uTime;

float calculateSurface(float x, float z) {
    float y = 0.0;
    y += (sin(x * 1.0 / SCALE + uTime * 1.0) + sin(x * 2.3 / SCALE + uTime * 1.5) + sin(x * 3.3 / SCALE + uTime * 0.4)) / 3.0;
    y += (sin(z * 0.2 / SCALE + uTime * 1.8) + sin(z * 1.8 / SCALE + uTime * 1.8) + sin(z * 2.8 / SCALE + uTime * 0.8)) / 3.0;
    return y;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    vec3 transformed = vec3(position);

    float strength = 2.0;
    pos.z += 1.2 * strength * calculateSurface(pos.x, pos.z);
    pos.y -= strength * calculateSurface(0.0, 0.0);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    fogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
    `;

    var fragmentShader = `
varying vec2 vUv;
varying float fogDepth;

uniform sampler2D uMap;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main() {
    vec2 uv = vUv * 10.0 + vec2(uTime * -0.05);

    uv.y += 0.01 * (sin(uv.x * 3.5 + uTime * 0.35) + sin(uv.x * 4.8 + uTime * 1.05) + sin(uv.x * 7.3 + uTime * 0.45)) / 3.0;
    uv.x += 0.12 * (sin(uv.y * 4.0 + uTime * 0.5) + sin(uv.y * 6.8 + uTime * 0.75) + sin(uv.y * 11.3 + uTime * 0.2)) / 3.0;
    uv.y += 0.12 * (sin(uv.x * 4.2 + uTime * 0.64) + sin(uv.x * 6.3 + uTime * 1.65) + sin(uv.x * 8.2 + uTime * 0.45)) / 3.0;

    vec4 tex1 = texture2D(uMap, uv * 1.0);
    vec3 blue = uColor;

    gl_FragColor = vec4(blue, 1.0) + (tex1 * 0.9);
    float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
    gl_FragColor = vec4(mix(gl_FragColor.rgb, fogColor, fogFactor), 0.5);
}
    `;

    // Material
    let texture = Loader.instance.getTexture('sea');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);
    this._uniforms = {
      uMap: {type: 't', value: texture},
      uTime: {type: 'f', value: 0},
      fogNear: { value: 1 },
      fogFar: { value: 2000 },
      fogColor: { value: new THREE.Color(0xffffff) },
      uColor: {type: 'f', value: new THREE.Color('#0051da')},
    };
    let material = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      fog: true
    });

    // Mesh
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -90 * Math.PI / 180;
    mesh.rotation.z = 90 * Math.PI / 180;
    mesh.receiveShadow = true;
    this.add(mesh);
  }

  /**
   * 更新します。
   */
  update() {
    this._uniforms.uTime.value += 0.007;
  }
}
