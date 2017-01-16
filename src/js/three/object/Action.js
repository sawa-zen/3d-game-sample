import TWEEN from 'tween.js';
import * as THREE from 'three';

/**
 * アクションクラスです。
 */
export default class Action {

  /** ウェイト */
  set weight(val) {
    if (val < 0) val = 0;
    if (1 < val) val = 1;
    this.weight_ = val;
  }
  get weight() { return this.weight_; }

  /** 走っているか否か */
  set isRunning(flg) { this.isRunning_ = flg; }
  get isRunning() { return this.isRunning_; }

  /**
   * コンストラクター
   * @constructor
   */
  constructor(action, weight=0, isRoop=true) {
    this.action_ = action;
    this.weight_ = weight;
    if (!isRoop) this.action_.setLoop(THREE.LoopOnce, 0);
    this.isRunning_ = false;
    this.weight = this.weight_;
  }

  /**
   * 再生します。
   */
  play() {
    if (this.action_) this.action_.play();
  }

  /**
   * リセットします。
   */
  reset() {
    if (this.action_) this.action_.reset();
  }

  /**
   * ウェイトを変化させます。
   */
  toWeight(target, duration, step) {
    console.info(this.weight_, target, duration);
    let tween = new TWEEN.Tween({ weight: this.weight_ })
      .to({ weight: target }, duration)
      .onUpdate(function() { step(this.weight); })
      .start();
	}

  /**
   * ウェイトを設定します。
   */
  setAction(val) {
    if (this.action_) this.action_.setEffectiveWeight(val);
  }
}
