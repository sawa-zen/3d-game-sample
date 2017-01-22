import Loader from '../loader/Loader';

/**
 * 音再生クラスです。
 */
export default class Sound {

  /** インスタンス */
  static get instance() {
    return Sound._instance || new Sound();
  }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    this._loader = Loader.instance;

    this._currentBGM = null;

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
    bgm.play();

    this._currentBGM = bgm;
  }

  /**
   * SEを再生します。
   */
  playSE(id, volume = 0.5) {
    let se = this._loader.getResult(id);
    // 音量を設定する
    se.volume = volume;
    se.play();
  }
}
