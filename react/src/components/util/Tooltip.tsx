import * as React from "react";
import ReactTooltip from 'react-tooltip'

export interface TooltipProps {
}

export default class Tooltip extends React.Component<TooltipProps, any> {
    constructor(props) {
        super(props);
    }

    public render() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        return (
            <ReactTooltip
                multiline={true}
                globalEventOff={isMobile ? 'touchstart' : undefined}
                delayShow={1000}
                key="tooltip"
                place="bottom"
                type="dark"
                effect="solid"/>
        );
    }
}