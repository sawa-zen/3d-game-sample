import Zenpad from 'zenpad.js';
import UILayer from './ui/UILayer';
import ThreeLayer from './three/ThreeLayer';

/**
 * ZenDashのメインクラス
 */
class ZenDash {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
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
