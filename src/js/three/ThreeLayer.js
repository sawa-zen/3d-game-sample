import * as THREE from 'three';
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
    console.info('ThreeLayer', THREE);

    // DOM
    this._wrapper = document.getElementById(domId);

    // シーン
    this._scene = new THREE.Scene();

    // カメラ
    this._camera = Camera.instance;

    // レンダラー
    this._renderer = new THREE.WebGLRenderer({antialias: true});
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(1);
    this._resize();
    this._wrapper.appendChild(this._renderer.domElement);
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
