import * as THREE from 'three';
import Plane from '../object/Plane';

/**
 * メインシーンクラスです。
 */
export default class MainScene extends THREE.Scene {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // 環境光
    let light = new THREE.DirectionalLight(0xffffff, 1);
    this.add(light);

    // 地面
    this._plane = new Plane();
    this.add(this._plane);

    // フォグ
    this.fog = new THREE.Fog(0xffffff, 50, 100);
  }
}
