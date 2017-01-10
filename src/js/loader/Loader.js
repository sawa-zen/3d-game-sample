import preloader from 'preloader';

/**
 * ローダークラス
 */
export default class Loader {

  /**
   * コンストラクター
   */
  constructor() {

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

    console.info('load', manifest);
    // ロードを開始
    this._preloader.load();
  }

  /**
   * 読み込み完了時のハンドラーです。
   */
  _onComplete() {
    // 読み込んだ値をセット
    this._assetList.map((data) => {
      data.value = this._preloader.get(data.url);
    });

    console.info(this._assetList);
  }
}
