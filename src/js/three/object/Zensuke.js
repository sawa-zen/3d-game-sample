import * as THREE from 'three';
import glsl from 'glslify';
import Loader from '../../loader/Loader';
import GameModel from '../../model/GameModel';

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
    // 速度
    this._velocity = 0.3;
    // 歩いているかどうか
    this._isWalking = false;
    // 向き
    this._agnle = 0;

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
    this._mesh.castShadow = true;
    this.add(this._mesh);

    // ミキサー
    this._mixer = new THREE.AnimationMixer(this._mesh);
    this._action.walk = this._mixer.clipAction(geometry.animations[2]);
    this._action.walk.setEffectiveWeight(1);
    this._action.jump = this._mixer.clipAction(geometry.animations[0]);
    this._action.jump.setEffectiveWeight(1);
    this._action.jump.loop = THREE.LoopOnce;
    this._action.idle = this._mixer.clipAction(geometry.animations[1]);
    this._action.idle.setEffectiveWeight(1);
  }

  /**
   * 本体用マテリアルを生成します。
   */
  _createBodyMaterial(materials) {
    let fixMaterials = [];
    for (let i=0; i < materials.length; i++) {
      let material = this._createFaceMaterial(materials[i]);
      material.needsUpdate = true;
      material.skinning = true;
      fixMaterials.push(material);
    }
    return new THREE.MeshFaceMaterial(fixMaterials);
  }

  /**
   * 表面マテリアルを生成します。
   */
  _createFaceMaterial(material) {
    return new THREE.ShaderMaterial({
      vertexShader: glsl('../../glsl/zensukeVertex.glsl'),
      fragmentShader: glsl('../../glsl/zensukeFragment.glsl'),
      uniforms: {
        lightDirection: {
          type: 'v3',
          value: new THREE.Vector4(3, 4, 5)
        },
        toonTexture: {
          type: 't',
          value: THREE.ImageUtils.loadTexture('images/texture/toon.png')
        },
        map: {
          type: 't',
          value: THREE.ImageUtils.loadTexture('model/zensuke.png')
        },
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2() }
      }
    });
  }

  /**
   * 更新します。
   */
  update() {
    let timeRatio = GameModel.instance.timeRatio;
    let delta = this._clock.getDelta() * 1.5;
    this._mixer.update(delta);

    // 歩いていれば前進させます。
    if(this._isWalking) {
      let axis = new THREE.Vector3(0, 1, 0);
      let rad = this._angle * Math.PI / 180;
      let velocity = this._velocity * timeRatio;
      let addVec = new THREE.Vector3(-velocity, 0, 0).applyAxisAngle(axis, rad);
      this.position.add(addVec);
    }
  }

  /**
   * 歩かせます。
   */
  walk(angle) {
    // 歩きモーション開始
    this._action.walk.play();
    // 歩いているフラグを立たせる
    this._isWalking = true;

    // 向きを変える
    this._angle = -(angle + 90);
    this.rotation.y = this._angle * Math.PI / 180;
  }

  /**
   * ジャンプさせます。
   */
  jump() {
    this._action.idle.crossFadeTo(this._action.jump, 3);
    console.info('jump');
  }

  /**
   * 止めます。
   */
  idle() {
    this._action.walk.stop();
    // 歩いているフラグを折る
    this._isWalking = false;
  }
}
