import * as THREE from 'three';

/**
 * クリーチャーベースクラス
 */
export default class Creature extends THREE.Object3D {

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
   * 止めます。
   */
  idle() {
    this._isMoving = false;
  }
}
