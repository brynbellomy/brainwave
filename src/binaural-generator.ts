
///<reference path='../typings/tsd.d.ts' />

import * as assert from 'assert'
import * as helpers from './helpers'
import { EventEmitter } from 'events'
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

    rx_isPlaying = new Rx.Subject<boolean>()
    private isPlaying: boolean = false


    constructor (audioContext: AudioContext = new AudioContext()) {
        this.audioContext = audioContext

        // oscillator channels

        this.leftChannel  = new OscillatorChannel(this.audioContext, 232)
        this.rightChannel = new OscillatorChannel(this.audioContext, 232)
        this.oscGainNode = this.audioContext.createGain()

        this.leftChannel.connect(this.oscGainNode)
        this.rightChannel.connect(this.oscGainNode)
        this.oscGainNode.connect(this.audioContext.destination)

        this.initializeAudioChannel()

        this.leftChannel.panning = -1
        this.rightChannel.panning = 1
        this.oscGain = 0.1

        this.rx_isPlaying.onNext(this.isPlaying)
    }

    private initializeAudioChannel(): void {

        this.audioChannel = new AudioFileChannel(this.audioContext, helpers.resourceURL('rain.m4a'))
        this.audioGainNode = this.audioContext.createGain()

        this.audioChannel.connect(this.audioGainNode)
        this.audioGainNode.connect(this.audioContext.destination)
        this.audioGain = 0.1
    }

    start (time:number = 0): void {
        assert(this.isPlaying === false)

        this.leftChannel.start(time)
        this.rightChannel.start(time)
        this.audioChannel.start(time)

        this.isPlaying = true
        this.rx_isPlaying.onNext(this.isPlaying)
    }

    stop (time:number = 0): void {
        assert(this.isPlaying === true)

        this.leftChannel.stop(time)
        this.rightChannel.stop(time)
        this.audioChannel.stop(time)

        this.isPlaying = false
        this.rx_isPlaying.onNext(this.isPlaying)
    }
}



