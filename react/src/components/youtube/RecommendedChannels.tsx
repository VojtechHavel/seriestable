import * as React from 'react';
import "./YoutubeOverview.scss"
import autobind from 'class-autobind';
import State from "../../types/State";
import {Category, Channel} from "../../types/generatedTypes";
import {addChannelToCategoryFunction} from "../../actions/api/youtubeApi";
import ChannelCategory from "./ChannelCategory";
import {RECOMMENDED_KEY} from "./ChannelCategory";

export interface RecommendedChannelsProps {
    channels: Channel[],
    categories: Category[],
    history: any,
    loadingRecommendedChannels: State,
    addChannelToCategory: addChannelToCategoryFunction,
    stopRecommendingChannel: (channelId: string) => any,
    addCategory: (categoryName: string) => any,
}

export interface RecommendedChannelsState {
}

class RecommendedChannels extends React.Component<RecommendedChannelsProps, RecommendedChannelsState> {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            showAddCategoryModal: false,
            addingCategoryState: State.INITIAL
        }
    }

    public render() {

        const category: Category = {
            channels: this.props.channels,
            key: RECOMMENDED_KEY,
            name: "Recommended Channels"
        };

        if(!this.props.channels.length){
            return null;
        }else {

            return <ChannelCategory
                history={this.props.history}
                category={category}
                removeChannelFromCategory={this.removeChannelFromCategory}
                addChannelToCategory={this.props.addChannelToCategory}
                categories={this.props.categories}
                addCategory={this.props.addCategory}
                removeCategory={() => {
                }}
                renameCategory={() => {
                }}
            />
        }
    }

    private removeChannelFromCategory(categoryName: string, channelId: string) {
        this.props.stopRecommendingChannel(channelId);
    }
}

export default RecommendedChannels;