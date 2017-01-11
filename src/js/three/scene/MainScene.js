import * as THREE from 'three';
import Plane from '../object/Plane';
import Zensuke from '../object/Zensuke';
import Zenpad from 'zenpad.js';

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

    this._onMoveStick = this._onMoveStick.bind(this);
    this._onReleaseStick = this._onReleaseStick.bind(this);

    // 環境光
    let light = new THREE.DirectionalLight(0xffffff, 1);
    this.add(light);

    // 地面
    this._plane = new Plane();
    this.add(this._plane);

    // Zensuke
    this._zensuke = new Zensuke();
    this.add(this._zensuke);

    // フォグ
    this.fog = new THREE.Fog(0xffffff, 50, 100);

    // zenpadを生成
    this._zenpad = new Zenpad('zenpadLayer');
    this._zenpad.on('moveStick', this._onMoveStick);
    this._zenpad.on('releaseStick', this._onReleaseStick);
  }

  /**
   * 更新します。
   */
  update() {
    this._zensuke.update();
  }

  /**
   * スティックが動かされた際のハンドラーです。
   */
  _onMoveStick(event) {
    console.info('moveStick', event);
  }

  /**
   * スティックの話された際のハンドラーです。
   */
  _onReleaseStick() {
    console.info('releaseStick');
  }
}
