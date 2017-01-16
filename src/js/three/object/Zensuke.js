import * as THREE from 'three';
import glsl from 'glslify';
import Loader from '../../loader/Loader';
import GameModel from '../../model/GameModel';
import Action from './Action';

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
    this._velocity = 0.37;
    // 歩いているかどうか
    this._isWalking = false;
    // 向き
    this._agnle = 0;

    this._loader = Loader.instance;
    let loadResult = this._loader.getResult('zensuke');
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
    this._action.walk = new Action(this._mixer.clipAction(geometry.animations[2]), 0, true);
    this._action.jump = new Action(this._mixer.clipAction(geometry.animations[0]), 0, false);
    this._action.idle = new Action(this._mixer.clipAction(geometry.animations[1]), 0, false);
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
    return new THREE.MultiMaterial(fixMaterials);
  }

  /**
   * 表面マテリアルを生成します。
   */
  _createFaceMaterial(material) {
    // トゥーンテクスチャ
    let toonTexture = this._loader.getTexture('toon');
    // モデルのテクスチャ
    let map = this._loader.getTexture('zensukeMap');

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
          value: toonTexture
        },
        map: {
          type: 't',
          value: map
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
    let delta = this._clock.getDelta();
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
    if(!this._isWalking) {
      // 歩きモーション開始
      this._action.walk.reset();
      this._action.walk.play();
      this._action.walk.toWeight(1, 50, (weight) => {
        this._action.walk.setAction(weight);
        this._action.idle.setAction(1 - weight);
      });
      // 歩いているフラグを立たせる
      this._isWalking = true;
    }

    // 向きを変える
    this._angle = -(angle + 90);
    this.rotation.y = this._angle * Math.PI / 180;
  }

  /**
   * 落とします。
   */
  fall(targetY) {
    let timeRatio = GameModel.instance.timeRatio;
    let gravity = new THREE.Vector3(0, -0.5, 0).multiplyScalar(timeRatio);
    let newPosition = this.position.clone().add(gravity);
    if(newPosition.y < targetY) {
      newPosition.y = targetY;
    }
    this.position.copy(newPosition);
  }

  /**
   * ジャンプさせます。
   */
  jump() {
    // モーション開始
    this._action.jump.reset();
    this._action.jump.play();
    this._action.jump.toWeight(1, 50, (weight) => {
      this._action.jump.setAction(weight);
      this._action.idle.setAction(1 - weight);
    });
  }

  /**
   * 止めます。
   */
  idle() {
    this._action.idle.reset();
		this._action.idle.play();
    this._action.idle.toWeight(1, 50, (weight) => {
      this._action.idle.setAction(weight);
      this._action.walk.setAction(1 - weight);
    });
    // 歩いているフラグを折る
    this._isWalking = false;
  }
}
