import * as THREE from 'three';
import Loader from '../../loader/Loader';

/**
 * Zensukeクラスです。
 */
export default class Zensuke extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // アクション
    this._action = {};

    let loadResult = Loader.instance.getResult('zensuke');
    let jsonLoader = new THREE.JSONLoader();
    let parseData = jsonLoader.parse(loadResult, 'model/');

    // クロック
    this._clock = new THREE.Clock();

    // ジオメトリ
    let geometry = parseData.geometry;
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    // マテリアル
    let material = this._createBodyMaterial(parseData.materials);

    // メッシュ
    this._mesh = new THREE.SkinnedMesh(geometry, material, false);
    this._mesh.rotation.y = -90 * Math.PI / 180;
    this.add(this._mesh);

    // ミキサー
    this._mixer = new THREE.AnimationMixer(this._mesh);
    this._action.walk = this._mixer.clipAction(geometry.animations[2]);
    this._action.walk.setEffectiveWeight(1);

    // 歩きモーション開始
    this._action.walk.play();
  }

  /**
   * 本体用マテリアルを生成します。
   */
  _createBodyMaterial(materials) {
    let fixMaterials = [];
    for (let i=0; i < materials.length; i++) {
      let material = materials[i];
      material.needsUpdate = true;
      material.skinning = true;
      fixMaterials.push(material);
    }
    return new THREE.MeshFaceMaterial(fixMaterials);
  }

  /**
   * 更新します。
   */
  update() {
    let delta = this._clock.getDelta();
    let theta = this._clock.getElapsedTime();
    this._mixer.update(delta);
  }
}
