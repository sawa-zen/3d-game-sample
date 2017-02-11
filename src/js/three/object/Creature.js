import * as THREE from 'three';
import Map from '../map/Map';

/**
 * クリーチャーベースクラス
 */
export default class Creature extends THREE.Object3D {

  /** 高さ */
  get height() { return this._height; }
  /** 歩く最高速度 */
  set maxSpeed(speed) { this._maxSpeed = speed; }
  /** 正面ベクトル */
  get frontVec() { return this._frontVec; }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // 速度
    this._velocity = new THREE.Vector3(0, 0, 0);
    // 向き
    this._agnle = 0;
    // 重力
    this._gravity = new THREE.Vector3(0, -0.08, 0);
    // 着地しているか否か
    this._isLanding = false;
    // 歩くスピード
    this._walkAcceleration = 0.03;
    // 歩く最高速度
    this._maxSpeed = 0.6;
    // ジャンプ力
    this._jumpPower = new THREE.Vector3(0, 1.6, 0);
    // 正面ベクトル
    this._frontVec = new THREE.Vector3(-1, 0, 0);
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
    this._frontVec = this._frontVec.applyAxisAngle(axis, rad - this.rotation.y);
    this.rotation.y = rad;
  }

  /**
   * 更新します。
   */
  update() {
    // 重力を追加
    this._addVectorToVelociry(this._gravity);

    // 壁判定処理
    let frontFace = Map.instance.getFrontFace(this);

    // 移動
    this.position.add(this._velocity);

    console.info(frontFace && frontFace.distance, ':', 2 + this._velocity.length() );
    if(frontFace && frontFace.distance < 2 + this._velocity.length()) {
      this.position.x = frontFace.point.x;
      this.position.z = frontFace.point.z;
    }

    // 地上に立たせる処理
    let underFace = Map.instance.getUnderFace(this);
    if(underFace && this.position.y - 0.5 < underFace.point.y) {
      this.position.y = underFace.point.y;
      this._velocity.y = 0;
      this._isLanding = true;
    } else {
      this._isLanding = false;
    }

    // 着地していて動いていなければ止める
    if(this._isLanding && !this._isMoving && !this._attackingCount) {
      this._velocity.x = this._velocity.z = 0;
    }
  }

  /**
   * 動かします。
   */
  move(angle) {
    // 向きを変える
    this._setAngle(angle);

    this._isMoving = true;

    // 現在向いている方向の単位ベクトル x 歩く速さ = 足すベクトル
    let addVec = this._frontVec.clone().multiplyScalar(this._walkAcceleration);
    this._addVectorToVelociry(addVec);
  }

  /**
   * ジャンプさせます。
   */
  jump() {
    if(!this._isLanding) {
      return;
    }
    // 上向きのベクトルを追加
    this._addVectorToVelociry(this._jumpPower);
    // ジャンプイベントを発火
    this.dispatchEvent({ type: 'jump' });
  }

  /**
   * 止めます。
   */
  idle() {
    this._isMoving = false;
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
}
