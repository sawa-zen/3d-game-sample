import * as THREE from 'three';
import MainScene from './scene/MainScene';
import Camera from './camera/Camera';

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

    // DOM
    this._wrapper = document.getElementById(domId);

    // シーン
    this._scene = new MainScene();

    // カメラ
    this._camera = Camera.instance;

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({antialias: true});
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(1);
    this._wrapper.appendChild(this._renderer.domElement);

    this._resize();
    window.addEventListener('resize', this._resize);

    // フレーム毎の更新
    this._tick();
  }

  /**
   * フレーム毎の更新です。
   */
  _tick() {
    requestAnimationFrame(this._tick);

    // フレームカウントをインクリメント
    this._frame++;

    // シーンの更新
    this._scene.update();

    // カメラの更新
    this._camera.update();

    // 描画
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * リサイズをかけます。
   */
  _resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this._renderer.domElement.setAttribute('width', String(width));
    this._renderer.domElement.setAttribute('height', String(height));
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }
}
