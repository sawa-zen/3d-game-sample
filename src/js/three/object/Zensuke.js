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
  /** 歩く最高速度 */
  set maxSpeed(speed) { this._maxSpeed = speed; };

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
    this._walkAcceleration = 0.02;
    // 歩く最高速度
    this._maxSpeed = 0.5;
    // 攻撃モーションカウント
    this._attackingCount = 0;
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
    this._action.attack = new Action(this._mixer.clipAction(geometry.animations[0]), 0, false);
    this._action.fall   = new Action(this._mixer.clipAction(geometry.animations[1]), 0, false);
    this._action.jump   = new Action(this._mixer.clipAction(geometry.animations[2]), 0, false);
    this._action.idle   = new Action(this._mixer.clipAction(geometry.animations[3]), 0, true);
    this._action.walk   = new Action(this._mixer.clipAction(geometry.animations[4]), 0, true);

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
    if(xzVelocity.length() > this._maxSpeed) {
      xzVelocity.normalize().multiplyScalar(this._maxSpeed);
      velocity.x = xzVelocity.x;
      velocity.z = xzVelocity.y;
    }
    if(velocity.y < -1.2) {
      velocity.y = -1.2;
    }
    this._velocity = velocity;
  }

  /**
   * 向きを変更します。
   */
  _setAngle(angle) {
    let axis = new THREE.Vector3(0, 1, 0);
    let rad = angle * Math.PI / 180;
    this._velocity = this._velocity.applyAxisAngle(axis, rad - this.rotation.y);
    this.rotation.y = rad;
  }

  /**
   * アクションを変更します。
   */
  _changeAction(actionName) {
    // 同じアクションなら処理しない
    if(this._currentAction == actionName) {
      return;
    }
    console.info(actionName);
    let oldAction = this._action[this._currentAction];
    this._currentAction = actionName;
    this._action[actionName].reset();
    this._action[actionName].play();
    this._action[actionName].toWeight(1, 70, (weight) => {
      this._action[actionName].setAction(weight);
      oldAction.setAction(1 - weight);
    });
  }

  /**
   * 更新します。
   */
  update() {
    // モデルのアニメーション更新
    let delta = this._clock.getDelta();
    this._mixer.update(delta);

    // 重力を追加
    this._addVectorToVelociry(this._gravity);

    // 着地していて動いていなければ止める
    if(this._isLanding && !this._isMoving && !this._attackingCount) {
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

    // アタックカウントをデクリメント
    if(this._attackingCount > 0) {
      this._attackingCount--;
    }

    if(this._attackingCount) {

    } else if(this._isLanding) {
      if(this._isMoving) {
        this._changeAction('walk');
      } else {
        this._changeAction('idle');
      }
    } else {
      if(this._velocity.y > 0) {
        this._changeAction('jump');
      } else if(this._velocity.y < -0.5) {
        this._changeAction('fall');
      }
    }
  }

  /**
   * 追跡します。
   */
  seek(target) {
    let sub = target.position.clone().sub(this.position.clone());

    // 近ければ止まらせる
    if(sub.length() < 5) {
      this.idle();
      return;
    }

    sub = new THREE.Vector2(sub.x, sub.z).normalize();

    let dot = sub.dot(new THREE.Vector2(-1, 0));
    let angle = Math.floor(Math.acos(dot) * 180 / Math.PI);

    let dot2 = sub.dot(new THREE.Vector2(0, 1));

    angle = dot2 >= 0 ? angle : -angle;
    this.move(angle);
  }

  /**
   * 動かします。
   */
  move(angle) {
    // 向きを変える
    this._setAngle(angle);

    this._isMoving = true;
    let timeRatio = GameModel.instance.timeRatio;
    let walkAcceleration = this._walkAcceleration * timeRatio;

    // 現在向いている方向の単位ベクトル x 歩く速さ = 足すベクトル
    let axis = new THREE.Vector3(0, 1, 0);
    let normalizeVec = new THREE.Vector3(-1, 0, 0).applyAxisAngle(axis, this.rotation.y).normalize();
    let addVec = normalizeVec.multiplyScalar(walkAcceleration);

    this._addVectorToVelociry(addVec);
  }

  /**
   * ジャンプさせます。
   */
  jump() {
    if(!this._isLanding) {
      return;
    }
    this._addVectorToVelociry(new THREE.Vector3(0, 1.6, 0));
  }

  /**
   * 攻撃します。
   */
  attack() {
    if(this._attackingCount > 0) {
      return;
    }
    this._changeAction('attack');

    // 現在向いている方向の単位ベクトル x 歩く速さ = 足すベクトル
    let axis = new THREE.Vector3(0, 1, 0);
    let addVec = new THREE.Vector3(-3, 0, 0).applyAxisAngle(axis, this.rotation.y);
    this._addVectorToVelociry(addVec);

    this._attackingCount = 15;
  }

  /**
   * 止めます。
   */
  idle() {
    this._isMoving = false;
  }
}
