import * as THREE from 'three';
import Zenpad from 'zenpad.js';
import UILayer from './ui/UILayer';
import ThreeLayer from './three/ThreeLayer';
import Loader from './loader/Loader';

/**
 * ZenDashのメインクラス
 */
class ZenDash {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {

    this._onCompleteLoad = this._onCompleteLoad.bind(this);

    this._loader = new Loader();
    this._loader.load([
      { id: 'tile', url: 'images/texture/tile.png' },
      { id: 'zensuke', url: 'model/zensuke.json' }
    ]);
    this._loader.addEventListener('complete', this._onCompleteLoad);

    // UIレイヤー
    let uiLayer = new UILayer('uiLayer');
    // zenpadを生成
    let zenpad = new Zenpad('zenpadLayer');
    // 3Dレイヤーの生成
    let three = new ThreeLayer('threeLayer');
  }

  /**
   * アセットの読み込み完了時のハンドラーです。
   */
  _onCompleteLoad() {
    var zensukeData = this._loader.getResult('zensuke');
    var jsonLoader = new THREE.JSONLoader();
    console.info(THREE.JSONLoader);
    console.info('comp2', jsonLoader.parse(zensukeData, 'model/'));
  }
}

window.addEventListener('load', () => {
  let zendash = new ZenDash();
});
