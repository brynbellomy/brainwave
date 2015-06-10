
///<reference path='../typings/tsd.d.ts' />

import { BinauralGenerator } from './binaural-generator'
import { UpdateTimer } from './update-timer'

function now(): number {
    return new Date().getTime()
}

export class Automation
{
    private intervalSignal: Rx.Observable<number>;
    private intervalSignalDisposable: Rx.Disposable;
    private updateTimer = new UpdateTimer()

    constructor(private duration: number,
                private startValue: number,
                private endValue: number,
                private interval: number,
                private block: (paramValue:number) => void) {
        this.intervalSignal = Rx.Observable.interval(interval)
    }

    start(): void {
        this.intervalSignalDisposable = this.intervalSignal
                                            .takeUntilWithTime(this.duration)
                                            .forEach((_) => {
                                                this.updateTimer.update(now())
                                                let paramValue = this.paramValueForTime(this.updateTimer.timeSinceFirstUpdate)
                                                this.block(paramValue)
                                            })
    }

    stop(): void {
        this.intervalSignalDisposable.dispose()
        this.intervalSignal = null
        this.intervalSignalDisposable = null
    }

    paramValueForTime (t:number): number {
        let valuePerTime = (this.endValue - this.startValue) / this.duration
        let paramValue = valuePerTime * t + this.startValue
        return paramValue
    }
}

