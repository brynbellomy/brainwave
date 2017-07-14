
import * as React from 'react'
import * as actions from '../actions.tsx'
import { autobind } from '../react-utils'

const TextField = require('material-ui/lib/text-field')
const RaisedButton = require('material-ui/lib/raised-button')

require('./NewSessionControls.less')


@autobind
class NewSessionControls extends React.Component < Props, State > {
    state: State = {
        duration: this.props.duration || 300,
        freqBase: this.props.freqBase || 330,
        diffStart: this.props.diffStart || 11,
        diffEnd: this.props.diffEnd || 23,
    }

    render() {
        return (
            <div className="new-session-controls">
                <div className="input-fields">
                    <TextField floatingLabelText="Duration (seconds)" value={'' + this.state.duration} onChange={ ev => this.setState({ duration: ev.target.value }) } />
                    <TextField floatingLabelText="Base frequency (Hz)" value={'' + this.state.freqBase} onChange={ ev => this.setState({ freqBase: ev.target.value }) } />
                    <TextField floatingLabelText="Start differential (Hz)" value={'' + this.state.diffStart} onChange={ ev => this.setState({ diffStart: ev.target.value }) } />
                    <TextField floatingLabelText="End differential (Hz)" value={'' + this.state.diffEnd} onChange={ ev => this.setState({ diffEnd: ev.target.value }) } />
                </div>

                <div className="input-buttons">
                    <RaisedButton label="Start" primary={true} onClick={ this.onClickStart } />
                    <RaisedButton label="Stop" onClick={ this.onClickStop } />
                </div>
            </div>
        )
    }

    onClickStart() {
        actions.startBrainwaveProgram(this.state.duration, {
            base: this.state.freqBase,
            start: this.state.diffStart,
            end: this.state.diffEnd,
        })
    }

    onClickStop() {
        actions.stopBrainwaveProgram()
    }
}

interface Props {
    duration?: number
    freqBase?: number
    diffStart?: number
    diffEnd?: number
}

interface State {
    duration?: number
    freqBase?: number
    diffStart?: number
    diffEnd?: number
}

export default NewSessionControls