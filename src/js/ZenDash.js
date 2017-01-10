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

    let loader = new Loader();
    loader.load([
      { id: 'tile', url: 'images/texture/tile.png' }
    ]);

    // UIレイヤー
    let uiLayer = new UILayer('uiLayer');
    // zenpadを生成
    let zenpad = new Zenpad('zenpadLayer');
    // 3Dレイヤーの生成
    let three = new ThreeLayer('threeLayer');
  }
}

window.addEventListener('load', () => {
  let zendash = new ZenDash();
});
