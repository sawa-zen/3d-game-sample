import * as THREE from 'three';
import Loader from '../../loader/Loader';

/**
 * スカイボックスクラス
 */
export default class SkyBox extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    this._loader = Loader.instance;

    // テクスチャー
    var texture = new THREE.CubeTexture([
      this._loader.getResult('px'),
      this._loader.getResult('nx'),
      this._loader.getResult('py'),
      this._loader.getResult('ny'),
      this._loader.getResult('pz'),
      this._loader.getResult('nz')
    ]);

    // テクスチャの更新を許可
    texture.needsUpdate = true;

    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = texture;

    // メッシュ
    var mesh = new THREE.Mesh(
      new THREE.BoxGeometry(500, 500, 500, 1, 1, 1),
      new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      })
    );

    this.add(mesh);
  }
}
