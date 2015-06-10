
///<reference path='../typings/tsd.d.ts' />

import { EventEmitter } from 'events'
import { IChannel, Channel } from './channel'


export class AudioFileChannel extends Channel implements IChannel
{
    private bufferSourceNode: AudioBufferSourceNode;

    rx_isLoading = new Rx.ReplaySubject<boolean>(1)

    constructor (audioContext: AudioContext, fileURL: string) {
        super(audioContext)

        this.bufferSourceNode = this.audioContext.createBufferSource()
        this.bufferSourceNode.connect(this.pan)
        
        this.load(fileURL)
    }

    load (url:string): void {
        this.rx_isLoading.onNext(true)

        let request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'arraybuffer'
  
        // Decode asynchronously
        request.onload = () => {
            this.audioContext.decodeAudioData(request.response, (buffer) => {
                this.bufferSourceNode.buffer = buffer
                this.rx_isLoading.onNext(false)
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


