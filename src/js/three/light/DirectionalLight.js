import * as THREE from 'three';

/**
 * 平行光源クラスです。
 */
export default class DirectionalLight extends THREE.DirectionalLight {

  /** インスタンス */
  static get instance() {
    return DirectionalLight._instance || new DirectionalLight();
  }

  /** ライト向き */
  get direction() { return this._direction; }
  get direction4() { return this._direction4; }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super(0xffffff, 0.5);

    this._direction = new THREE.Vector3(3, 3, 4);
    this._direction4 = new THREE.Vector4(3, 3, 4);
    this._shadowSize = 50;
    this._relativePosition = new THREE.Vector3(10, 10, -10);

    this.position.copy(this._relativePosition);

    this.castShadow = true;
    this.shadow.camera.top = this._shadowSize;
    this.shadow.camera.left = -this._shadowSize / 3;
    this.shadow.camera.right = this._shadowSize;
    this.shadow.camera.bottom = -this._shadowSize;
    this.shadow.camera.near = 10;
    this.shadow.camera.far = 50;
    this.shadow.mapSize.width = this.shadow.mapSize.height = 512;

    this._shadowHelper = new THREE.CameraHelper(this.shadow.camera);

    DirectionalLight._instance = this;
  }

  /**
   * ヘルパーを表示します。
   */
  showHelper() {
    this.parent.add(this._shadowHelper);
  }

  /**
   * 追跡します。
   */
  seek(target) {
    let targetPos = target.position.clone();
    let newPosition = targetPos.clone().add(this._relativePosition);
    this.position.copy(newPosition);
    this.target = target;
  }
}
