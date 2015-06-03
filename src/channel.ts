
///<reference path='../typings/tsd.d.ts' />

import { EventEmitter } from 'events'

export interface IChannel {
    start (time?:number): void;
    stop (time?:number): void;
    connect (node:AudioNode, output?:number, input?:number): void;
    disconnect (output?:number): void;
}

export class Channel extends EventEmitter
{
    public audioContext: AudioContext;
    protected pan: StereoPannerNode;

    get panning (): number { return this.pan.pan.value }
    set panning (panning:number) {
        if (panning < -1 || panning > 1) { throw new Error('setPanning() must be passed a value between -1 (left) and 1 (right)') }
        this.pan.pan.value = panning
    }

    constructor (audioContext:AudioContext) {
        super()

        this.audioContext = audioContext
        this.pan = this.audioContext.createStereoPanner()
    }

    connect (node:AudioNode, output?:number, input?:number): void {
        this.pan.connect(node, output, input)
    }

    disconnect (output?:number): void {
        this.pan.disconnect(output)
    }
}


