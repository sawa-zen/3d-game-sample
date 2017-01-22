import React from 'react';
import Sound from '../sound/Sound';

/**
 * サウンド再生ボタン
 */
export default class SoundButton extends React.Component {

  /**
   * コンストラクター
   * @constructor
   */
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  /**
   * 描画します。
   */
  render() {
    return (
      <div className="soundButton" onClick={this._onClick}>
        音
      </div>
    );
  }

  /**
   * クリック時のハンドラーです。
   */
  _onClick() {
    // BMG再生
    Sound.instance.playBGM('bgm', 0.1);
  }
}
