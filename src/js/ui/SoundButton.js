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

    this.state = {
      mute: Sound.instance.mute
    }

    this._onClick = this._onClick.bind(this);
  }

  /**
   * 描画します。
   */
  render() {
    let icon = () => {
      if(this.state.mute) {
        return (<i className="fa fa-volume-up" aria-hidden="true"></i>);
      } else {
        return (<i className="fa fa-volume-off" aria-hidden="true"></i>);
      }
    };
    return (
      <div className="soundButton" onClick={this._onClick}>
        {icon()}
      </div>
    );
  }

  /**
   * クリック時のハンドラーです。
   */
  _onClick() {
    Sound.instance.mute = !Sound.instance.mute;
    this.setState({
      mute: Sound.instance.mute
    });
  }
}
