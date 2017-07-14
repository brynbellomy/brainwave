
import * as π from 'pants'
import * as luxor from 'luxor'

import * as assert from 'assert'
import * as helpers from './helpers'

import { EventEmitter } from 'events'
import { Channel } from './channel'
import { OscillatorChannel } from './oscillator-channel'
import { AudioFileChannel } from './audio-file-channel'
import { Automation } from './automation'
import { autobind } from '../react-utils'


export class BinauralGenerator extends luxor.Store < Props, State > {
    automation: Automation
    audioContext: AudioContext
    leftChannel:  OscillatorChannel
    rightChannel: OscillatorChannel
    audioChannel: AudioFileChannel

    private oscGainNode: GainNode
    private audioGainNode: GainNode

    get audioGain(): number { return this.audioGainNode.gain.value }
    set audioGain(val: number) { this.audioGainNode.gain.value = val }

    get oscGain(): number { return this.oscGainNode.gain.value }
    set oscGain(val: number) { this.oscGainNode.gain.value = val }

    constructor(props: Props) {
        super(props)

        this.audioContext = this.props.audioContext
        this.initGraph()
    }

    initGraph() {
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

        this.setState({ isPlaying: false })
    }

    private initializeAudioChannel(): void {
        this.audioChannel = new AudioFileChannel(this.audioContext, helpers.resourceURL('rain.m4a'))
        this.audioGainNode = this.audioContext.createGain()

        this.audioChannel.connect(this.audioGainNode)
        this.audioGainNode.connect(this.audioContext.destination)
        this.audioGain = 0.1
    }

    initialState(): State {
        return {
            isPlaying: false,
        } as State
    }

    start (time:number = 0): void {
        assert(this.state.isPlaying === false)

        if (!π.nullish(this.automation)) {
            this.automation.start()
        }

        this.leftChannel.start(time)
        this.rightChannel.start(time)
        this.audioChannel.start(time)

        this.setState({ isPlaying: true })
    }

    stop (time:number = 0): void {
        assert(this.state.isPlaying === true)

        this.leftChannel.stop(time)
        this.rightChannel.stop(time)
        this.audioChannel.stop(time)

        if (!π.nullish(this.automation)) {
            this.automation.stop()
        }

        this.initGraph()
        this.setState({ isPlaying: false })
    }
}

interface Props {
    audioContext: AudioContext
}

interface State {
    isPlaying: boolean
}


