import Loader from '../loader/Loader';
import {_} from 'lodash';

/**
 * 音再生クラスです。
 */
export default class Sound {

  /** インスタンス */
  static get instance() {
    return Sound._instance || new Sound();
  }

  /** ミュートしているかどうか */
  get mute() { return this._isMuted; }
  set mute(bool) {
    if(this._currentBGM) {
      this._currentBGM.muted = bool;
      if(bool) {
        this._currentBGM.pause();
      } else {
        // this._currentBGM.play();
      }
    }
    _.map(this._SEList, (se) => {
      se.muted = bool;
    });
    this._isMuted = bool;
  }

  /** BGMを再生しているかどうか */
  get isPlayingBGM() {
    return !!this._currentBGM;
  }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    this._loader = Loader.instance;

    this._currentBGM = null;
    this._SEList = [];
    this._isMuted = true;

    Sound._instance = this;
  }

  /**
   * BGMを再生します。
   */
  playBGM(id, volume = 0.5, loop = true) {
    if(this._currentBGM) {
      this._currentBGM.pause();
    }

    let bgm = this._loader.getResult(id);
    // 音量を設定する
    bgm.volume = volume;
    // ループ再生を設定
    bgm.loop = loop;
    bgm.muted = this._isMuted;
    // bgm.play();

    this._currentBGM = bgm;
  }

  /**
   * SEを再生します。
   */
  playSE(id, volume = 0.5) {
    if(!this._SEList[id]) {
      this._SEList[id] = this._loader.getResult(id);
    }
    let se = this._SEList[id];
    // はじめに戻しておく
    se.currentTime = 1;
    // 音量を設定する
    se.volume = volume;
    se.muted = this._isMuted;
    // se.play();
  }
}
