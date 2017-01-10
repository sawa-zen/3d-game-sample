import preloader from 'preloader';
import {_} from 'lodash';
import * as THREE from 'three';

/**
 * ローダークラス
 */
export default class Loader extends THREE.EventDispatcher {

  /**
   * コンストラクター
   */
  constructor() {
    super();

    this._onComplete = this._onComplete.bind(this);

    // アセットデータリスト
    this._assetList = [];

    this._preloader = preloader({
      xhrImages: false,
      loadFullAudio: false,
      loadFullVideo: false
    });
    this._preloader.on('complete', this._onComplete);
  }

  /**
   * マニフェストのアセットを読み込みます。
   */
  load(manifest) {
    manifest = manifest || [];

    manifest.map((data) => {
      this._preloader.add(data.url);
      this._assetList.push({ id: data.id, url: data.url, value: null });
    });

    // ロードを開始
    this._preloader.load();
  }

  /**
   * 指定したIDのアセットを取得します。
   */
  getResult(id) {
    let data = _.find(this._assetList, (data) => {
      return data.id == id;
    });

    return data.value;
  }

  /**
   * 読み込み完了時のハンドラーです。
   */
  _onComplete() {
    // 読み込んだ値をセット
    this._assetList.map((data) => {
      data.value = this._preloader.get(data.url);
    });

    console.info('comp');
    // 完了イベントを発火
    this.dispatchEvent({ type: 'complete' });
  }
}
