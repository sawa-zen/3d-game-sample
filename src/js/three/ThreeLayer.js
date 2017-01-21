import * as THREE from 'three';
import MainScene from './scene/MainScene';
import Camera from './camera/Camera';
import Stats from 'stats.js';
import GameModel from '../model/GameModel';
import TWEEN from 'tween.js';

/**
 * 3Dレイヤーのメインクラスです。
 */
export default class ThreeLayer {

  /**
   * コンストラクター
   * @constructor
   */
  constructor(domId) {

    this._tick = this._tick.bind(this);
    this._resize = this._resize.bind(this);

    // モデル
    this._model = GameModel.instance;

    // DOM
    this._wrapper = document.getElementById(domId);

    // シーン
    this._scene = new MainScene();

    // カメラ
    this._camera = Camera.instance;

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({antialias: false});
    this._renderer.setClearColor(0xffffff);
    this._renderer.setPixelRatio(1);
    this._renderer.shadowMap.enabled = true;
    this._wrapper.appendChild(this._renderer.domElement);

    this._resize();
    window.addEventListener('resize', this._resize);

    // FPSの表示
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    // フレーム毎の更新
    this._tick();
  }

  /**
   * フレーム毎の更新です。
   */
  _tick() {
    requestAnimationFrame(this._tick);

    // 計測開始
    this._stats.begin();

    // TWEENの更新
    TWEEN.update();
    // 比較係数を更新
    this._model.updateTimeRatio();
    // シーンの更新
    this._scene.update();
    // 描画
    this._renderer.render(this._scene, this._camera);

    // 計測終了
    this._stats.end();
  }

  /**
   * リサイズをかけます。
   */
  _resize() {
    let width = this._wrapper.clientWidth;
    let height = this._wrapper.clientHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }
}
