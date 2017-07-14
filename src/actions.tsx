
import * as luxor from 'luxor'
import { binaural } from './stores'
import { Automation } from './audio/automation'

interface IFrequencyRange {
    base: number;
    start: number;
    end: number;
}

export var startBrainwaveProgram = luxor.asyncAction((duration:number, freqRange:IFrequencyRange) => {
    binaural.leftChannel.frequency = freqRange.base

    const automationPollInterval = 50
    binaural.automation = new Automation(
        duration *  1000,                     // duration
        freqRange.base + freqRange.start,     // start value
        freqRange.base + freqRange.end,       // end value
        automationPollInterval,               // automation poll interval
        function (paramValue) { binaural.rightChannel.frequency = paramValue }
    )

    binaural.start()
    return Promise.resolve(null)
})

export var stopBrainwaveProgram = luxor.asyncAction(() => {
    binaural.stop()

    return Promise.resolve(null)
})
