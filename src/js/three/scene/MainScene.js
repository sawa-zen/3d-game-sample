import * as THREE from 'three';
import Camera from '../camera/Camera';
import SkyBox from '../object/SkyBox';
import Map from '../map/Map';
import Zensuke from '../object/Zensuke';
import Zenpad from 'zenpad.js';
import DirectionalLight from '../light/DirectionalLight';
import Sound from '../../sound/Sound';

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

    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onTouchStartB = this._onTouchStartB.bind(this);
    this._onTouchStartA = this._onTouchStartA.bind(this);
    this._onMoveStick = this._onMoveStick.bind(this);
    this._onReleaseStick = this._onReleaseStick.bind(this);

    // スティックが動いているか否か
    this._stickIsMoving = false;
    // スティックの倒れている向き
    this._stickAngle = 0;

    // カメラ
    this._camera = Camera.instance;

    // 環境光源
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambientLight);

    // 平行光源
    this._directionalLight = DirectionalLight.instance;
    this.add(this._directionalLight);
    //this._directionalLight.showHelper();

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

    // 敵
    this._enemy = new Zensuke();
    this._enemy.position.y = 40;
    this._enemy.maxSpeed = 0.1;
    this._enemy.scale.multiplyScalar(0.5);
    this.add(this._enemy);

    // フォグ
    this.fog = new THREE.Fog(0x0051da, 200, 450);

    // zenpadを生成
    this._zenpad = new Zenpad('zenpadLayer');
    this._zenpad.on('moveStick', this._onMoveStick);
    this._zenpad.on('releaseStick', this._onReleaseStick);
    this._zenpad.on('touchstartA', this._onTouchStartA);
    this._zenpad.on('touchstartB', this._onTouchStartB);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);

    // BGM再生
    Sound.instance.playBGM('bgm');
  }

  /**
   * 更新します。
   */
  update() {
    // Zensukeの更新
    if(this._stickIsMoving) {
      this._zensuke.move(this._camera.angle + this._stickAngle);
    }
    this._zensuke.update();

    this._enemy.seek(this._zensuke);
    this._enemy.update();

    this._map.update();

    this._camera.update(this._zensuke);
    this._directionalLight.seek(this._zensuke);
  }

  /**
   * キーダウン時のハンドラーです。
   */
  _onKeyDown(event) {
    switch(event.code) {
      case "Space":
        this._zensuke.jump();
        break;
      case "KeyL":
        this._zensuke.attack();
        break;
      case "KeyW":
        this._stickAngle = 0;
        this._stickIsMoving = true;
        break;
      case "KeyA":
        this._stickAngle = 90;
        this._stickIsMoving = true;
        break;
      case "KeyS":
        this._stickAngle = 180;
        this._stickIsMoving = true;
        break;
      case "KeyD":
        this._stickAngle = -90;
        this._stickIsMoving = true;
        break;
    }
  }

  /**
   * キーダウン時のハンドラーです。
   */
  _onKeyUp(event) {
    switch(event.code) {
      case "KeyA":
      case "KeyW":
      case "KeyS":
      case "KeyD":
        this._stickIsMoving = false;
        this._zensuke.idle();
        break;
    }
  }

  /**
   * スティックが動かされた際のハンドラーです。
   */
  _onMoveStick(event) {
    this._stickAngle = -(event.angle + 90);
    this._stickIsMoving = true;
  }

  /**
   * スティックの話された際のハンドラーです。
   */
  _onReleaseStick() {
    this._zensuke.idle();
    this._stickIsMoving = false;
  }

  /**
   * Aボタンタッチ開始時のハンドラーです。
   */
  _onTouchStartA() {
    this._zensuke.jump();
  }

  /**
   * Bボタンタッチ開始時のハンドラーです。
   */
  _onTouchStartB() {
    this._zensuke.attack();
  }
}
