import * as THREE from 'three';

/**
 * カメラのクラスです。
 */
export default class Camera extends THREE.PerspectiveCamera {

  /** インスタンスを取得します。 */
  static get instance() {
    return Camera._instance || new Camera();
  }

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 500);

    this._xDistance = 30 * 1;
    this._yDistance = 15 * 1;

    this.position.x = this._xDistance;
    this.position.y = this._yDistance;
    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update(targetPosition) {
    let lookAtPositon = targetPosition.clone().add(new THREE.Vector3(0, 3, 0));
    this.position.x = targetPosition.x + this._xDistance;

    let newY = targetPosition.y + this._yDistance;
    if(newY < this._yDistance) {
      newY = this._yDistance;
    }
    this.position.y = newY;

    this.position.z = targetPosition.z;
    this.lookAt(lookAtPositon);
  }
}
