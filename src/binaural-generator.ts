
///<reference path='../typings/tsd.d.ts' />

import { EventEmitter } from 'events'

export class BinauralGenerator
{
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

        this.leftChannel  = new OscillatorChannel(this.audioContext, -1, 333)
        this.rightChannel = new OscillatorChannel(this.audioContext,  1, 333 + 17)
        this.oscGainNode = this.audioContext.createGain()

        this.leftChannel.connect(this.oscGainNode)
        this.rightChannel.connect(this.oscGainNode)
        this.oscGainNode.connect(this.audioContext.destination)

        // audio channel

        this.audioChannel = new AudioFileChannel(this.audioContext, 'http://listen.local:8000/public/rain.m4a')
        this.audioGainNode = this.audioContext.createGain()

        this.audioChannel.connect(this.audioGainNode)
        this.audioGainNode.connect(this.audioContext.destination)

        this.oscGain = 0.1
        this.audioGain = 0.1
    }

    start (time:number = 0): void {
        this.leftChannel.start(time)
        this.rightChannel.start(time)
        this.audioChannel.start(time)
    }
}

export class OscillatorChannel
{
    public audioContext: AudioContext;

    private osc:  OscillatorNode;
    private pan:  StereoPannerNode;

    get frequency (): number { return this.osc.frequency.value }
    set frequency (freqInHz:number) {
        if (freqInHz < 0) { throw new Error('The argument to setFrequency() must be positive.') }
        this.osc.frequency.value = freqInHz
    }

    get panning (): number { return this.pan.pan.value }
    set panning (panning:number) {
        if (panning < -1 || panning > 1) { throw new Error('setPanning() must be passed a value between -1 (left) and 1 (right)') }
        this.pan.pan.value = panning
    }

    constructor (audioContext:AudioContext, panDirection:number, freqInHz:number) {
        this.audioContext = audioContext

        this.osc = this.audioContext.createOscillator()
        this.osc.type = 'sine'
        // this.osc.detune.value = 100 // value in cents

        this.pan = this.audioContext.createStereoPanner()

        this.frequency = freqInHz
        this.panning = panDirection

        this.osc.connect(this.pan)
    }

    connect (node:AudioNode, output?:number, input?:number): void {
        this.pan.connect(node, output, input)
    }

    disconnect (output?:number): void {
        this.pan.disconnect(output)
    }

    start (time:number = 0): void {
        this.osc.start(time)
    }

    stop (time:number = 0): void {
        this.osc.stop(time)
    }
}   


export class AudioFileChannel extends EventEmitter
{
    private audioContext: AudioContext;
    private bufferSourceNode: AudioBufferSourceNode;
    private ready: boolean = false;

    constructor (audioContext: AudioContext, fileURL: string) {
        super()
        this.audioContext = audioContext
        this.bufferSourceNode = this.audioContext.createBufferSource()
        this.load(fileURL)
    }

    connect (node:AudioNode, output?:number, input?:number): void {
        this.bufferSourceNode.connect(node, output, input)
    }

    load (url:string): void {
        let request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'arraybuffer'
  
        // Decode asynchronously
        request.onload = () => {
            this.audioContext.decodeAudioData(request.response, (buffer) => {
                this.bufferSourceNode.buffer = buffer
                this.ready = true
                this.emit('ready')
            }, () => { throw new Error('Error loading audio file') })
        }

        request.send()
    }

    start (time:number = 0) {
        this.bufferSourceNode.start(0)
    }

    stop (time:number = 0) {
        this.bufferSourceNode.stop(0)
    }
}



