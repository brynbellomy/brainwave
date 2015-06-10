
///<reference path='../typings/tsd.d.ts' />

import { BinauralGenerator } from './binaural-generator'
import { Automation } from './automation'


let binaural = new BinauralGenerator()
let automation: Automation

interface IFrequencyRange {
    base: number;
    start: number;
    end: number;
}

function startBrainwaveProgram (duration:number, freqRange:IFrequencyRange): void {
    binaural.leftChannel.frequency = freqRange.base

    let automationPollInterval = 50
    automation = new Automation(
        duration *  1000,                     // duration
        freqRange.base + freqRange.start,     // start value
        freqRange.base + freqRange.end,       // end value
        automationPollInterval,               // automation poll interval
        function (paramValue) { binaural.rightChannel.frequency = paramValue }
    )

    binaural.start()
    automation.start()
}

function stopBrainwaveProgram(): void {
    automation.stop()
    automation = null

    binaural.stop()
    binaural = new BinauralGenerator
}

$(() => {
    let $oscGain = $('#osc-gain')
    $oscGain.val( formatFloatString(binaural.oscGain) )
    $oscGain.change(() => binaural.oscGain = parseFloat($oscGain.val()))

    let $audioGain = $('#audio-gain')
    $audioGain.val( formatFloatString(binaural.audioGain) )
    $audioGain.change(() => binaural.audioGain = parseFloat($audioGain.val()))

    let $audioPan  = $('#audio-pan')
    $audioPan.val( formatFloatString(binaural.audioChannel.panning) )
    $audioPan.change (() => binaural.audioChannel.panning = parseFloat($audioPan.val()))


    let $leftFreq  = $('#frequency-left')
    let $rightFreq = $('#frequency-right')
    let $brainFreq = $('#frequency-diff')
    // $leftFreq.val(`${binaural.leftChannel.frequency}`)
    // $rightFreq.val(`${binaural.rightChannel.frequency}`)

    binaural.leftChannel.rx_frequency.subscribeOnNext ((freq) => $leftFreq.html ( formatFloatString(freq) ))
    binaural.rightChannel.rx_frequency.subscribeOnNext((freq) => $rightFreq.html( formatFloatString(freq) ))

    let brainFreq = Rx.Observable.combineLatest(
        binaural.leftChannel.rx_frequency,
        binaural.rightChannel.rx_frequency,
        (leftFreq, rightFreq) => { return rightFreq - leftFreq }
    )
    brainFreq.subscribeOnNext((freq) => $brainFreq.html( formatFloatString(freq) ))

    // $leftFreq.keydownAsObservable().subscribeOnNext((evt)  => binaural.leftChannel.frequency  = parseFloat($leftFreq.val()))
    // $rightFreq.keydownAsObservable().subscribeOnNext((evt) => binaural.rightChannel.frequency = parseFloat($rightFreq.val()))

    let $startButton = $('#button-start')
    let $stopButton  = $('#button-stop')
    
    let $duration = $('input#duration')
    let $freqBase = $('input#frequency-base')
    let $freqStart = $('input#frequency-start')
    let $freqEnd = $('input#frequency-end')

    setParameterDefaults()
 
    $startButton.on('click', () => {
        let duration = parseFloat($duration.val())
        let base = parseFloat($freqBase.val())
        let start = parseFloat($freqStart.val())
        let end = parseFloat($freqEnd.val())
        startBrainwaveProgram(duration, {base, start, end})
    })
    $stopButton.on('click', () => stopBrainwaveProgram())

    let $statusMessage = $('#status-message')

    binaural.audioChannel.rx_isLoading.subscribeOnNext((isLoading) => {
        console.log('AUDIO LOADING?', isLoading)
        if (isLoading) {
            $statusMessage.show()
        }
        else {
            $statusMessage.hide()
        }
    })
    
    function setParameterDefaults (): void {
        $duration.val('600')
        $freqBase.val('232')
        $freqStart.val('13')
        $freqEnd.val('7')
    }

})

function formatFloatString(num:number): string {
    return num.toLocaleString(undefined, {maximumFractionDigits: 3, minimumFractionDigits: 3})
}




