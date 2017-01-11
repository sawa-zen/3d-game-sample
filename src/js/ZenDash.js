import * as THREE from 'three';
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

    // アセットのロード
    this._loader = Loader.instance;
    this._loader.load([
      { id: 'tile', url: 'images/texture/tile.png' },
      { id: 'zensuke', url: 'model/zensuke.json' }
    ]);
    this._loader.addEventListener('complete', this._onCompleteLoad);
  }

  /**
   * セットアップ
   */
  _setup() {
    // UIレイヤー
    let uiLayer = new UILayer('uiLayer');
    // 3Dレイヤーの生成
    let three = new ThreeLayer('threeLayer');
  }

  /**
   * アセットの読み込み完了時のハンドラーです。
   */
  _onCompleteLoad() {
    this._setup();
  }
}

window.addEventListener('load', () => {
  let zendash = new ZenDash();
});
