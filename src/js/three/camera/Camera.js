import * as THREE from 'three';

/**
 * カメラのクラスです。
 */
export default class Camera extends THREE.PerspectiveCamera {

  /** インスタンスを取得します。 */
  static get instance() {
    return Camera._instance || new Camera();
  }

  /** 角度 */
  get angle() { return this._angle; }

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 1500);

    this._angle = 0;
    this._xDistance = 35 * 1.1;
    this._yDistance = 12 * 1.1;
    this._lookAtAddVector = new THREE.Vector3(0, 3, 0);

    this.position.x = this._xDistance;
    this.position.y = this._yDistance;
    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update(target) {
    let lookAtPositon = target.position.clone().add(this._lookAtAddVector);

    let sub = target.position.clone().sub(this.position.clone());
    sub = new THREE.Vector2(sub.x, sub.z).normalize();
    let dot = sub.dot(new THREE.Vector2(-1, 0));
    let angle = Math.floor(Math.acos(dot) * 180 / Math.PI);
    let dot2 = sub.dot(new THREE.Vector2(0, 1));
    angle = dot2 >= 0 ? angle : -angle;
    this._angle = angle;

    // ターゲットとカメラを結ぶベクトル
    let targetToCamera = this.position.clone().sub(lookAtPositon);
    // 距離を算出
    let distance = targetToCamera.length();
    targetToCamera = targetToCamera.normalize().multiplyScalar(this._xDistance);
    let newPosition = targetToCamera.add(target.position.clone());
    newPosition.y = target.position.y + this._yDistance;

    if(newPosition.y < this._yDistance) {
      newPosition.y = this._yDistance;
    }

    this.position.copy(newPosition);

    this.lookAt(lookAtPositon);
  }
}
