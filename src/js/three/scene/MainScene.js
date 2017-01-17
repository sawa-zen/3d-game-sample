import * as THREE from 'three';
import Camera from '../camera/Camera';
import SkyBox from '../object/SkyBox';
import Map from '../map/Map';
import Zensuke from '../object/Zensuke';
import Zenpad from 'zenpad.js';
import DirectionalLight from '../light/DirectionalLight';

/**
 * メインシーンクラスです。
 */
export default class MainScene extends THREE.Scene {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    this._onClickB = this._onClickB.bind(this);
    this._onMoveStick = this._onMoveStick.bind(this);
    this._onReleaseStick = this._onReleaseStick.bind(this);

    // カメラ
    this._camera = Camera.instance;

    // 環境光源
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambientLight);

    // 平行光源
    this._directionalLight = DirectionalLight.instance;
    this.add(this._directionalLight);

    // スカイボックス
    let skybox = new SkyBox();
    this.add(skybox);

    // 地面
    this._map = new Map();
    this.add(this._map);

    // Zensuke
    this._zensuke = new Zensuke();
    this._zensuke.position.y = 40;
    this.add(this._zensuke);

    // フォグ
    this.fog = new THREE.Fog(0xc1edff, 50, 200);

    // zenpadを生成
    this._zenpad = new Zenpad('zenpadLayer');
    this._zenpad.on('moveStick', this._onMoveStick);
    this._zenpad.on('releaseStick', this._onReleaseStick);
    this._zenpad.on('clickB', this._onClickB);
  }

  /**
   * 更新します。
   */
  update() {
    // Zensukeの更新
    this._zensuke.update();

    // var rayStartPos = this._zensuke.position.clone().add(new THREE.Vector3(0, 5, 0));
    // var ray = new THREE.Raycaster(rayStartPos, new THREE.Vector3(0, -1, 0).normalize());
    // var target = ray.intersectObjects(this._map.children)[0];
    //
    // if(!target) {
    //   this._zensuke.fall(-1000);
    // } else if(target && target.distance > 0.55) {
    //   this._zensuke.fall(target.point.y);
    // }

    this._camera.update(this._zensuke.position);
    this._directionalLight.seek(this._zensuke);
  }

  /**
   * スティックが動かされた際のハンドラーです。
   */
  _onMoveStick(event) {
    this._zensuke.walk(-(event.angle + 90));
  }

  /**
   * スティックの話された際のハンドラーです。
   */
  _onReleaseStick() {
    this._zensuke.idle();
  }

  /**
   * Bボタン押下時のハンドラーです。
   */
  _onClickB() {
    this._zensuke.jump();
  }
}
