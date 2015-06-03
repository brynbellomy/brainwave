
///<reference path='../typings/tsd.d.ts' />

import * as $ from 'jquery'
// import * as Rx from 'rx'
// global['Rx'] = Rx
// import 'rxjs-jquery'
import { BinauralGenerator } from './binaural-generator'
import { Automation } from './automation'


let binaural = new BinauralGenerator()
let freqRange = { base: 333, start: 10, end: 16 }
let automation: Automation

function startBrainwaveProgram(): void {
    automation = new Automation(20 * 1000, freqRange.base + freqRange.start, freqRange.base + freqRange.end, 500, (paramValue) => {
        binaural.rightChannel.frequency = paramValue
        console.log(`[left: ${binaural.leftChannel.frequency}, right: ${binaural.rightChannel.frequency}] delta: ${binaural.rightChannel.frequency - binaural.leftChannel.frequency}`)
    })
    binaural.leftChannel.frequency = freqRange.base
    binaural.start()
    automation.start()
}

function stopBrainwaveProgram(): void {
    automation.stop()
    automation = null

    binaural.stop()
}

$(() => {
    let $oscGain = $('#osc-gain')
    $oscGain.val(`${binaural.oscGain}`)
    $oscGain.change(() => binaural.oscGain = parseFloat($oscGain.val()))

    // let $audioGain = $('#audio-gain')
    // $audioGain.val(`${binaural.audioGain}`)
    // $audioGain.change(() => binaural.audioGain = parseFloat($audioGain.val()))

    // let $audioPan  = $('#audio-pan')
    // $audioPan.val(`${binaural.audioChannel.panning}`)
    // $audioPan.change (() => binaural.audioChannel.panning = parseFloat($audioPan.val()))


    let $leftFreq  = $('#frequency-left')
    let $rightFreq = $('#frequency-right')
    $leftFreq.val(`${binaural.leftChannel.frequency}`)
    $rightFreq.val(`${binaural.rightChannel.frequency}`)

    binaural.leftChannel.frequencyObservable.subscribeOnNext((freq) => $leftFreq.val(`${freq}`))
    binaural.rightChannel.frequencyObservable.subscribeOnNext((freq) => $rightFreq.val(`${freq}`))

    // $leftFreq.keydownAsObservable().subscribeOnNext((evt)  => binaural.leftChannel.frequency  = parseFloat($leftFreq.val()))
    // $rightFreq.keydownAsObservable().subscribeOnNext((evt) => binaural.rightChannel.frequency = parseFloat($rightFreq.val()))

    let $startButton = $('#button-start')
    let $stopButton = $('#button-stop')
    $startButton.on('click', () => binaural.start())
    $stopButton.on('click', () => binaural.stop())

    let $statusMessage = $('#status-message')

    // binaural.audioChannel.on('loading', () => {
    //     $statusMessage.show()
    // })

    // binaural.audioChannel.on('ready', () => {
    //     $statusMessage.hide()
    //     startBrainwaveProgram()
    // })

    startBrainwaveProgram()
})



namespace blahblah {
    export function blahhh() {
        console.log('hi')
    }
}

blahblah.blahhh()



