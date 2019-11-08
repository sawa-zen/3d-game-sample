/**
 * ゲームモデルです。
 */
export default class GameModel {

  /** インスタンス */
  static get instance() {
    return GameModel._instance || new GameModel();
  }

  /** 比較係数 */
  get timeRatio() { return this._timeRatio; }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    this._timeRatio = 1;
    this._lastTime = 0;

    GameModel._instance = this;
  }

  /**
   * 比較係数を更新します。
   */
  updateTimeRatio() {
    if(this._lastTime > 0) {
      // 1フレーム当たりの時間(ミリ秒)
      let FPS_60_SEC = 1000 / 60;
      // 差分時間をセット
      let dTime = new Date().getTime() - this._lastTime;
      // FPS60との比較係数をセット
      this._timeRatio = dTime / FPS_60_SEC;
    }
    // 現在時間をセット
    this._lastTime = new Date().getTime();
  }
}
