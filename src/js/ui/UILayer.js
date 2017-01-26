import React from 'react';
import ReactDOM from 'react-dom';
import SoundButton from './SoundButton';

/**
 * UIレイヤーのメインクラスです。
 */
export default class UILayer {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    // メインクラスを描画
    ReactDOM.render(
      <div />,
      document.getElementById('uiLayer')
    );
  }
}
