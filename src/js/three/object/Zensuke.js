import * as THREE from 'three';
import TWEEN from 'tween.js';
import glsl from 'glslify';
import {_} from 'lodash';
import Loader from '../../loader/Loader';
import GameModel from '../../model/GameModel';
import Action from './Action';
import Sound from '../../sound/Sound';
import Creature from './Creature';

/**
 * Zensukeクラスです。
 */
export default class Zensuke extends Creature {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    this._onJump = this._onJump.bind(this);

    // アクション
    this._action = {};
    // カレントアクション名
    this._currentAction = 'idle';
    // クロック
    this._clock = new THREE.Clock();
    // 攻撃モーションカウント
    this._attackingCount = 0;

    this._loader = Loader.instance;
    let loadResult = this._loader.getResult('zensuke');
    let jsonLoader = new THREE.JSONLoader();
    let parseData = jsonLoader.parse(loadResult, 'model/');

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

    // 高さ
    this._height = this._mesh.geometry.boundingBox.max.y - this._mesh.geometry.boundingBox.min.y;

    this.addEventListener('jump', this._onJump);
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
   * アクションを変更します。
   */
  _changeAction(actionName) {
    // 同じアクションなら処理しない
    if(this._currentAction == actionName) {
      return;
    }
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
    super.update();

    // モデルのアニメーション更新
    let delta = this._clock.getDelta();
    this._mixer.update(delta);

    // アタックカウントをデクリメント
    if(this._attackingCount > 0) {
      this._attackingCount--;
    }

    if(this._attackingCount) {
      // ?
    } else if(this._isLanding) {
      if(this._isMoving) {
        this._changeAction('walk');
      } else {
        this._changeAction('idle');
      }
    } else {
      if(this._velocity.y > 0) {
        this._changeAction('jump');
      } else if(this._velocity.y < -this._maxSpeed) {
        this._changeAction('fall');
      }
    }
  }

  /**
   * 攻撃します。
   */
  attack() {
    if(this._attackingCount > 0) {
      return;
    }
    // SEを再生
    Sound.instance.playSE('sword', 0.2);
    // アタックモーションを再生
    this._changeAction('attack');

    // 現在向いている方向の単位ベクトル x 歩く速さ = 足すベクトル
    let axis = new THREE.Vector3(0, 1, 0);
    let addVec = new THREE.Vector3(-3, 0, 0).applyAxisAngle(axis, this.rotation.y);
    this._addVectorToVelociry(addVec);

    this._attackingCount = 15;
  }

  /**
   * ジャンプした際のハンドラーです。
   */
  _onJump() {
    // SEを再生
    Sound.instance.playSE('jump');
  }
}
