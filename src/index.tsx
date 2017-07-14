
import * as React from 'react'
import * as ReactDOM from 'react-dom'

require('./styles/index.less')

import { binaural } from './stores'
import Mixer from './components/Mixer.tsx'
import Monitoring from './components/Monitoring.tsx'
import NewSessionControls from './components/NewSessionControls.tsx'

const Card = require('material-ui/lib/card/card')
const CardHeader = require('material-ui/lib/card/card-header');
const CardTitle = require('material-ui/lib/card/card-title')
const CardText = require('material-ui/lib/card/card-text');

const rootElem = document.getElementById('app')

binaural.audioChannel.rx_isLoading.subscribe(isLoading => {
    console.log('AUDIO LOADING?', isLoading)
    if (isLoading) {
    }
    else {
    }
}, err => {
    console.error('Error loading audio:', err)
}, () => {
    console.log('Audio loaded')
})

binaural.rx_observableState.subscribeOnNext(state => {
    console.log('NEW STATE, rendering', state)
    ReactDOM.render(
        <div id="content">
            <h1>illuminator brain spa</h1>

            <Card>
                <div id="card-new-session">
                    <CardHeader title="New session" subtitle="Use these controls to start a new spa session." />
                    <CardText>
                        <NewSessionControls />
                    </CardText>
                </div>
            </Card>

            <Card>
                <CardHeader title="Monitoring" subtitle="" />
                <CardText>
                    <Monitoring />
                </CardText>
            </Card>

            <Card>
                <CardHeader title="Mixer" subtitle="" />
                <CardText>
                    <Mixer />
                </CardText>
            </Card>

        </div>
    , rootElem)
})