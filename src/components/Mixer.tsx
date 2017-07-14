
import * as React from 'react'

const Slider = require('material-ui/lib/slider')


class Mixer extends React.Component < Props, {} > {
    render() {
        return (
            <div className="mixer">
                <Slider name="osc-gain"   min={0}  max={0.5} step={0.01} defaultValue={0.25} onChange={ this.onOscGainChanged } description="Binaural beats volume" />
                <Slider name="audio-gain" min={0}  max={0.5} step={0.01} defaultValue={0.25} onChange={ function(){} } description="Audio volume" />
                <Slider name="audio-pan"  min={-1} max={1}   step={0.01} defaultValue={0} onChange={ function(){} } description="Audio pan" />
            </div>
        )
    }

    onOscGainChanged(ev, value) {
        console.log('onOscGainChanged', value)
    }
}

interface Props {
}

export default Mixer