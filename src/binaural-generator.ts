
///<reference path='../typings/tsd.d.ts' />

import { EventEmitter } from 'events'
import * as Rx from 'rx'
import { Channel } from './channel'
import { OscillatorChannel } from './oscillator-channel'
import { AudioFileChannel } from './audio-file-channel'
import { Automation } from './automation'


export class BinauralGenerator
{
    automation: Automation;
    audioContext: AudioContext;
    leftChannel:  OscillatorChannel;
    rightChannel: OscillatorChannel;
    audioChannel: AudioFileChannel;

    private oscGainNode: GainNode;
    private audioGainNode: GainNode;

    get audioGain(): number { return this.audioGainNode.gain.value }
    set audioGain(val: number) { this.audioGainNode.gain.value = val }

    get oscGain(): number { return this.oscGainNode.gain.value }
    set oscGain(val: number) { this.oscGainNode.gain.value = val }


    constructor (audioContext: AudioContext = new AudioContext()) {
        this.audioContext = audioContext

        // oscillator channels

        this.leftChannel  = new OscillatorChannel(this.audioContext, 232)
        this.rightChannel = new OscillatorChannel(this.audioContext, 232)
        this.oscGainNode = this.audioContext.createGain()

        this.leftChannel.connect(this.oscGainNode)
        this.rightChannel.connect(this.oscGainNode)
        this.oscGainNode.connect(this.audioContext.destination)

        this.leftChannel.panning = -1
        this.rightChannel.panning = 1
        this.oscGain = 0.1
    }

    private initializeAudioChannel(): void {

        this.audioChannel = new AudioFileChannel(this.audioContext, 'http://illumntr-website.s3-website-us-west-2.amazonaws.com/rain.m4a')
        this.audioGainNode = this.audioContext.createGain()

        this.audioChannel.connect(this.audioGainNode)
        this.audioGainNode.connect(this.audioContext.destination)
        this.audioGain = 0.1
    }

    start (time:number = 0): void {
        this.leftChannel.start(time)
        this.rightChannel.start(time)
        // this.audioChannel.start(time)
    }

    stop (time:number = 0): void {
        this.leftChannel.stop(time)
        this.rightChannel.stop(time)
        // this.audioChannel.stop(time)
    }
}



