import * as THREE from 'three';

/**
 * 平行光源クラスです。
 */
export default class DirectionalLight extends THREE.DirectionalLight {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super(0xffffff);

    this._shadowSize = 5;
    this._relativePosition = new THREE.Vector3(10, 10, -10);

    this.position.copy(this._relativePosition);

    this.castShadow = true;
    this.shadow.camera.top = this._shadowSize;
    this.shadow.camera.left = -this._shadowSize;
    this.shadow.camera.right = this._shadowSize;
    this.shadow.camera.bottom = -this._shadowSize;
    this.shadow.mapSize.width = 128;
    this.shadow.mapSize.height = 128;

    this._shadowHelper = new THREE.CameraHelper(this.shadow.camera);
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
    let newPosition = target.position.clone().add(this._relativePosition);
    this.position.copy(newPosition);
    this.target = target;
  }
}
