
///<reference path='../typings/tsd.d.ts' />

import * as Rx from 'rx'
import { EventEmitter } from 'events'
import { IChannel, Channel } from './channel'


export class OscillatorChannel extends Channel implements IChannel
{
    private osc: OscillatorNode;

    get frequency (): number { return this.osc.frequency.value }
    set frequency (freqInHz:number) {
        if (freqInHz < 0) { throw new Error('frequency must be positive.') }
        this.osc.frequency.value = freqInHz
        this._frequencySubject.onNext(freqInHz)
    }

    private _frequencySubject: Rx.BehaviorSubject<number>;
    get frequencyObservable(): Rx.Observable<number> {
        return this._frequencySubject.asObservable()
    }

    constructor (audioContext:AudioContext, freqInHz:number) {
        super(audioContext)

        this._frequencySubject = new Rx.BehaviorSubject<number>(freqInHz)

        this.osc = this.audioContext.createOscillator()
        this.osc.type = 'sine'
        // this.osc.detune.value = 100 // value in cents
        this.frequency = freqInHz

        this.osc.connect(this.pan)
    }

    start (time:number = 0): void {
        this.osc.start(time)
    }

    stop (time:number = 0): void {
        this.osc.stop(time)
    }
}   

