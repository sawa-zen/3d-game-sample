import * as THREE from 'three';
import TWEEN from 'tween.js';
import glsl from 'glslify';
import {_} from 'lodash';
import Loader from '../../loader/Loader';
import GameModel from '../../model/GameModel';
import Action from './Action';
import Map from '../map/Map';

/**
 * Zensukeクラスです。
 */
export default class Zensuke extends THREE.Object3D {

  /** 高さ */
  get height() { return this._height; }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // アクション
    this._action = {};
    // カレントアクション名
    this._currentAction = 'idle';
    // 速度
    this._velocity = new THREE.Vector3(0, 0, 0);
    // 歩くスピード
    this._walkAcceleration = 0.18;
    // 向き
    this._agnle = 0;
    // 重力
    this._gravity = new THREE.Vector3(0, -0.08, 0);
    // 着地しているか否か
    this._isLanding = false;

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
    this._mesh.geometry.computeBoundingBox();
    this._mesh.rotation.y = -90 * Math.PI / 180;
    this._mesh.castShadow = true;
    this.add(this._mesh);

    // ミキサー
    this._mixer = new THREE.AnimationMixer(this._mesh);
    this._action.fall = new Action(this._mixer.clipAction(geometry.animations[0]), 0, false);
    this._action.jump = new Action(this._mixer.clipAction(geometry.animations[1]), 0, false);
    this._action.idle = new Action(this._mixer.clipAction(geometry.animations[2]), 0, false);
    this._action.walk = new Action(this._mixer.clipAction(geometry.animations[3]), 0, true);

    // 境界ヘルパー
    this._boxHelper = new THREE.BoxHelper(this._mesh);
    //this.add(this._boxHelper);

    // 高さ
    this._height = this._mesh.geometry.boundingBox.max.y - this._mesh.geometry.boundingBox.min.y;
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
   * 速度にベクトルを足します。
   */
  _addVectorToVelociry(vec) {
    let velocity = this._velocity.clone();
    velocity.add(vec);
    let xzVelocity = new THREE.Vector2(velocity.x, velocity.z);
    if(xzVelocity.length() > 0.35) {
      xzVelocity.normalize().multiplyScalar(0.35);
      velocity.x = xzVelocity.x;
      velocity.z = xzVelocity.y;
    }
    this._velocity = velocity;
  }

  /**
   * アクションを変更します。
   */
  _changeAction(actionName) {
    // 同じアクションなら処理しない
    if(this._currentAction == actionName) {
      return;
    }
    this._currentAction = actionName;
    console.info(this._currentAction);
    this._action[actionName].reset();
    this._action[actionName].play();
    this._action[actionName].toWeight(1, 150, (weight) => {
      _.each(this._action, (value, key) => {
        if(key == actionName) {
          value.setAction(weight);
        } else {
          value.setAction(1 - weight);
        }
      });
    });
  }

  /**
   * 更新します。
   */
  update() {
    // モデルのアニメーション更新
    let timeRatio = GameModel.instance.timeRatio;
    let delta = this._clock.getDelta();
    if(this._currentAction == 'fall' || this._currentAction == 'jump') {
      delta = 0;
    }
    this._mixer.update(delta);

    // 重力を追加
    this._addVectorToVelociry(this._gravity);

    // 着地していて動いていなければ止める
    if(this._isLanding && !this._isMoving) {
      this._velocity.x = this._velocity.z = 0;
    }

    // 移動
    this.position.add(this._velocity);

    // 地上に立たせる処理
    let underFace = Map.instance.getUnderFace(this);
    if(underFace && this.position.y < underFace.point.y - this._gravity.y) {
      this.position.y = underFace.point.y;
      this._velocity.y = 0;
      this._isLanding = true;
    } else {
      this._isLanding = false;
    }

    if(this._isLanding) {
      if(this._isMoving) {
        this._changeAction('walk');
      } else {
        this._changeAction('idle');
      }
    } else {
      if(this._velocity.y > 0) {
        this._changeAction('jump');
      } else {
        this._changeAction('fall');
      }
    }
  }

  /**
   * 動かします。
   */
  move(angle) {
    this._isMoving = true;
    let timeRatio = GameModel.instance.timeRatio;
    let axis = new THREE.Vector3(0, 1, 0);
    let rad = angle * Math.PI / 180;
    let walkAcceleration = this._walkAcceleration * timeRatio;
    this._addVectorToVelociry(new THREE.Vector3(-walkAcceleration, 0, 0).applyAxisAngle(axis, rad));
    // 向きを変える
    this.rotation.y = angle * Math.PI / 180;
  }

  /**
   * 落とします。
   */
  fall() {
    // this._action.fall.weight = 0;
    // this._action.fall.reset();
    // this._action.fall.play();
    // this._action.fall.toWeight(1, 100, (weight) => {
    //   this._action.fall.setAction(weight);
    //   this._action.jump.setAction(1 - weight);
    //   this._action.idle.setAction(1 - weight);
    //   this._action.walk.setAction(1 - weight);
    // });
  }

  /**
   * ジャンプさせます。
   */
  jump() {
    this._addVectorToVelociry(new THREE.Vector3(0, 2, 0));
  }

  /**
   * 止めます。
   */
  idle() {
    this._isMoving = false;
  }
}
