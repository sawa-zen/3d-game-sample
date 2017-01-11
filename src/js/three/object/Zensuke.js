import * as THREE from 'three';
import Loader from '../../loader/Loader';

/**
 * Zensukeクラスです。
 */
export default class Zensuke extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    let loadResult = Loader.instance.getResult('zensuke');
    let jsonLoader = new THREE.JSONLoader();
    let parseData = jsonLoader.parse(loadResult, 'model/');

    console.info(parseData);
  }
}
