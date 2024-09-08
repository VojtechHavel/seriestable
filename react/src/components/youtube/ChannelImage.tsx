import * as React from "react";
import autobind from 'class-autobind';
import {getDefaultIconUrl} from "../../config/getDefaultIconUrl";
import {callReloadChannelImage} from "../../actions/api/youtubeApi";

interface ChannelTileProps {
    channelId: string,
    imageUrl: string,
    className?: string
}

interface ChannelTileState {
    imageUrl: string
}

export default class ChannelImage extends React.Component<ChannelTileProps, ChannelTileState> {

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: this.props.imageUrl,
        };
        autobind(this);
    }

    public render(){
        return <img className={this.props.className} onError={()=>{
            this.setState({
                imageUrl: getDefaultIconUrl()
            });

            callReloadChannelImage(this.props.channelId).then((newUrl: string)=>{
                this.setState({
                    imageUrl: newUrl
                })
            });
        }} src={this.state.imageUrl}/>
    }
}