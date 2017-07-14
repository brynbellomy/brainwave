
import * as React from 'react'
import FrequencyReadout from './FrequencyReadout.tsx'

class Monitoring extends React.Component < Props, {} > {
    render() {
        return (
            <div className="monitoring">
                <FrequencyReadout label="Left frequency" value={this.props.freqLeft} />
                <FrequencyReadout label="Right frequency" value={this.props.freqRight} />
                <FrequencyReadout label="R - L = current brainwave frequency" value={this.props.freqDifferential} />
            </div>
        )
    }
}

interface Props {
    freqLeft?: number
    freqRight?: number
    freqDifferential?: number
}

export default Monitoring