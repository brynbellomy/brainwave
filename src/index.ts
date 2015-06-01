
///<reference path='../typings/tsd.d.ts' />

import * as $ from 'jquery'
import { BinauralGenerator } from './binaural-generator'

let binaural = new BinauralGenerator()
binaural.audioChannel.on('ready', () => {
    binaural.start()
})

$(() => {
    let $oscGain = $('#osc-gain')
    $oscGain.val(`${binaural.oscGain}`)
    $oscGain.change(() => binaural.oscGain = parseFloat($oscGain.val()))

    let $audioGain = $('#audio-gain')
    $audioGain.val(`${binaural.audioGain}`)
    $audioGain.change(() => binaural.audioGain = parseFloat($audioGain.val()))

    let $leftFreq  = $('#frequency-left')
    let $rightFreq = $('#frequency-right')
    $leftFreq.val(`${binaural.leftChannel.frequency}`)
    $rightFreq.val(`${binaural.rightChannel.frequency}`)

    $leftFreq.change (() => binaural.leftChannel.frequency  = parseFloat($leftFreq.val()))
    $rightFreq.change(() => binaural.rightChannel.frequency = parseFloat($rightFreq.val()))

    // binaural.leftChannel.on('changed:frequency', (newFreq) => $leftFreq.)
})





