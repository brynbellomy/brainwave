
///<reference path='../typings/tsd.d.ts' />


export class UpdateTimer
{
    constructor() {}

    /** The number of seconds since `update()` was last called. */
    timeSinceLastUpdate = 0

    /** The number of seconds since the first time `update()` was called. */
    timeSinceFirstUpdate = 0

    /** The number of seconds since the last time `lap()` was called. */
    timeSinceLastLap = 0

    /** The value of the `currentTime` argument passed to `update()` the last time `update()` was called. */
    previousUpdateTime = 0

    /** The number of frames rendered since the start of the app. Useful if you need to lock your game's update
        cycle to the framerate. For example this allows you to perform certain actions n frames from now, instead
        of n seconds. */
    frameCount = 0

    /** A flag to indicate whether `update()` has ever been called. */
    private firstUpdate = true

    /** Call this function at the beginning your scene loop's `update()` method. */
    update (currentTime: number): void {
        // "first update" setup stuff
        if (this.firstUpdate) {
            this.previousUpdateTime = currentTime
            this.firstUpdate = false
        }

        // update the basic timers
        this.timeSinceLastUpdate = currentTime - this.previousUpdateTime
        this.timeSinceFirstUpdate += this.timeSinceLastUpdate
        this.previousUpdateTime = currentTime

        // update lap timer
        this.timeSinceLastLap += this.timeSinceLastUpdate

        // update frame count
        this.frameCount++
    }

    /** Reset the lap timer to zero.  The lap timer is useful for tracking some arbitrary event that doesn't necessarily occur every time `update()` is called.  */
    lap() {
        this.timeSinceLastLap = 0
    }
}