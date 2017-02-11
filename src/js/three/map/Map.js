import * as THREE from 'three';
import {_} from 'lodash';
import Plane from './Plane';
import Plate from './Plate';
import Sea from './Sea';

/**
 * マップクラスです。
 */
export default class Map extends THREE.Object3D {

  /** インスタンス */
  static get instance() {
    return Map._instance || new Map();
  }

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // 着地ターゲット
    this._rayTargetList = [];
    // レイのスタートに追加するベクトル
    this._rayStartAddPos = new THREE.Vector3(0, 5, 0);
    // レイの向きベクトル
    this._rayFrontVector = new THREE.Vector3(0, -1, 0);

    // 地面
    this._plane = new Plane();
    this._plane.position.y = -10;
    this.add(this._plane);
    this._registTarget(this._plane);

    // プレート
    for(let i = 1; i < 6; i++) {
      let plate = new Plate();
      plate.position.x = -20 * i;
      plate.position.y = 10 * i;
      this.add(plate);
      this._registTarget(plate);
    }

    // 海
    this._sea = new Sea();
    this.add(this._sea);

    Map._instance = this;
  }

  /**
   * ターゲット真下のfaceを取得します。
   */
  getUnderFace(target) {
    let rayStartPos = target.position.clone().add(this._rayStartAddPos);
    let ray = new THREE.Raycaster(rayStartPos, this._rayFrontVector, 0, 20);
    return ray.intersectObjects(this._rayTargetList)[0];
  }

  /**
   * ターゲット正面のfaceを取得します。
   */
  getFrontFace(target) {
    let frontVec = target.frontVec.clone().normalize();
    let rayStartPos = target.position.clone().add(new THREE.Vector3(0, 2, 0));
    let ray = new THREE.Raycaster(rayStartPos, frontVec, 0, 20);
    return ray.intersectObjects(this._rayTargetList)[0];
  }

  /**
   * レイのターゲットに登録
   */
  _registTarget(target) {
    let rayTargetList = _.union(this._rayTargetList, target.children);
    this._rayTargetList = rayTargetList;
  }

  /**
   * 更新します。
   */
  update() {
    this._sea.update();
  }
}
