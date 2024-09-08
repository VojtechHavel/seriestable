import * as React from "react";
import ChannelCategory, {ChannelCategoryProps} from "./ChannelCategory";
import {
    callAddCategory,
    callAddChannelToCategory,
    callGetCategoriesPage,
    callRemoveCategory,
    callRemoveChannelFromCategory,
    callRenameCategory,
    callStopRecommendingChannel
} from "../../actions/api/youtubeApi";
import autobind from 'class-autobind';
import State from "../../types/State";
import {connect} from "react-redux";
import RecommendedChannels, {RecommendedChannelsProps} from "./RecommendedChannels";
import {withRouter} from "react-router";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import {Category, Channel} from "../../types/generatedTypes";
import AddCategory from "./AddCategory";
import Loading from "../util/Loading";
import {VISITOR_ROLE} from "../../actions/userActions";
import {Link} from "react-router-dom";

interface YoutubeOverviewState {
    categories: Category[],
    recommendedChannels: Channel[],
    loadingPage: State
}

interface YoutubeOverviewProps {
    userState: UserState,
    history: any
}

class YoutubeOverview extends React.Component<YoutubeOverviewProps, YoutubeOverviewState> {

    constructor(props) {
        super(props);
        document.title = "Videomark.app";
        this.state = {
            categories: [],
            recommendedChannels: [],
            loadingPage: State.PROCESSING,
        };

        this.loadPage();
        autobind(this);
        console.log("constructor call");
    }


    public render() {
        console.log("this.props.userState.role", this.props.userState.role);
        const recommendedChannelsViewProps: RecommendedChannelsProps = {
            loadingRecommendedChannels: this.state.loadingPage,
            channels: this.state.recommendedChannels,
            categories: this.state.categories,
            addChannelToCategory: this.addChannelToCategory,
            stopRecommendingChannel: this.stopRecommendingChannel,
            history: this.props.history,
            addCategory: this.addCategory
        };
        return (
            <div className={"container"}>

                <div className={"page-section page-header"}><h1>Channels</h1></div>

                <RecommendedChannels key="RecommendedChannelsView" {...recommendedChannelsViewProps} />

                {this.renderCategories()}

                {this.props.userState.role === VISITOR_ROLE ? this.renderSignupToAddChannel() :
                    <AddCategory addCategory={this.addCategory}/>}
            </div>
        );
    }

    public componentDidUpdate(prevProps: YoutubeOverviewProps, prevState, snapshot) {
        console.log("componentDidUpdate");
        if (prevProps.userState !== this.props.userState || prevProps.userState.apiToken !== this.props.userState.apiToken) {
            this.setState({
                categories: []
            });
            this.loadPage();
        }
    }

    private renderSignupToAddChannel() {
        return (
            <Link to={"/signup"}>
                <div className={"hover-shadow"}>
                    <div className={"page-section signup-section"}>
                        <h3>Sign up to add your favorite channels.</h3>
                    </div>
                </div>
            </Link>)
    }

    private renderCategories() {
        if (this.props.userState.role === VISITOR_ROLE) {
            return null;
        } else if (this.state.loadingPage === State.OK) {
            return this.state.categories.sort((a, b) => {
                return a.name.localeCompare(b.name)
            }).map(category => {
                const channelCategoryProps: ChannelCategoryProps = {
                    history: this.props.history,
                    category,
                    removeChannelFromCategory: this.removeChannelFromCategory,
                    addChannelToCategory: this.addChannelToCategory,
                    categories: this.state.categories,
                    addCategory: this.addCategory,
                    removeCategory: this.removeCategory,
                    renameCategory: this.renameCategory
                };

                return <ChannelCategory key={category.key} {...channelCategoryProps} />
            })
        } else if (this.state.loadingPage === State.PROCESSING) {
            return <Loading/>
        } else {
            return (
                <div className={"channel-category"}>
                    <div className={"page-section hover-icon-parent"}>
                        <div className={"channel-category-menu row"}><span
                            className={"page-header-title"}>Error occurred while loading categories. Please try again later.</span>
                        </div>
                    </div>
                </div>
            )
        }


    }

    // add new channel into category - user clicks add channel and then inserts channel's url
    private addChannelToCategory(categoryName: string, channelName: string) {
        return callAddChannelToCategory(categoryName, channelName).then((channel: Channel) => {
            this.state.categories.map((category) => {
                if (category.name === categoryName) {
                    category.channels.push(channel);
                }
            });

            this.setState({
                categories: this.state.categories
            })
        })
    }

    private loadPage() {
        callGetCategoriesPage().then((data) => {
            if (data) {
                console.log("loadCategories data", data);
                this.setState({
                    categories: data.categories,
                    recommendedChannels: data.recommendedChannels,
                    loadingPage: State.OK
                })
            } else {
                console.log("loadCategories data", data);
            }
        }, () => {
            this.setState({loadingPage: State.ERROR})
        })
    }

    private removeChannelFromCategory(categoryName: string, channelId: string) {
        this.setState({
            categories: this.state.categories.map(category => {
                if (categoryName === category.name) {
                    category.channels = category.channels.filter(channel => {
                            if (channel.youtubeId === channelId) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    );
                }
                return category;
            })
        });
        callRemoveChannelFromCategory(categoryName, channelId);
    }

    private stopRecommendingChannel(channelId: string) {
        this.setState({
            recommendedChannels: this.state.recommendedChannels.filter(channel => {
                return channel.youtubeId !== channelId
            })
        });
        callStopRecommendingChannel(channelId);
    }

    private addCategory(categoryName: string) {
        return callAddCategory(categoryName).then((data) => {
            const newCategory: Category = {
                name: categoryName,
                key: categoryName + "Key",
                channels: []
            };
            this.setState({
                categories: this.state.categories.concat(newCategory)
            })
        });
    }

    private removeCategory(categoryName: string) {
        return callRemoveCategory(categoryName).then((data) => {
            const filteredCategories = this.state.categories.filter(category => {
                return category.name !== categoryName;
            });

            this.setState({categories: filteredCategories});
        })
    }

    private renameCategory(oldCategoryName: string, newCategoryName: string) {
        return callRenameCategory(oldCategoryName, newCategoryName).then((data) => {
            this.state.categories.map(category => {
                if (category.name === oldCategoryName) {
                    category.name = newCategoryName;
                }
            });
            this.setState({
                categories: this.state.categories
            })
        });
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};

export default withRouter(connect(mapStateToProps, {})(YoutubeOverview) as any);