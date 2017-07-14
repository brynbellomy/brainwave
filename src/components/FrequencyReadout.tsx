
import * as React from 'react'

require('./FrequencyReadout.less')

class FrequencyReadout extends React.Component < Props, {} > {
    render() {
        return (
            <div className="frequency-readout">
                <span className="label">{this.props.label}</span>
                <span className="value">{this.props.value}</span>
            </div>
        )
    }
}

interface Props {
    label: string
    value: number
}

export default FrequencyReadout