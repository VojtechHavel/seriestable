import {Switch, Route, withRouter} from 'react-router-dom'
import * as React from 'react';
import "./Routes.scss";
import LoginPage from "../account/LoginPage";
import requireLoggedIn from "../account/RequireLoggedIn"
import SignUpPage from "../account/SignUpPage";
import ContactPage from "../static/ContactPage";
import SettingsPage from "../account/SettingsPage";
import ForgotPasswordPage from "../account/ForgotPasswordPage";
import ResetPasswordPage from "../account/ResetPasswordPage";
import PageNotFound from "../static/PageNotFound";
import Loading from "../util/Loading";
import YoutubeOverview from "../youtube/YoutubeOverview";
import ChannelPage from "../youtube/ChannelPage";
import VideoPage from "../youtube/VideoPage";
import TagVideosPage from "../youtube/TagVideosPage";
import ContinueWatchingPage from "../youtube/ContinueWatchingPage";
import TagPage from "../youtube/TagPage";
import ChannelCategoryPage from "../youtube/ChannelCategoryPage";
import NotesPage from "../youtube/NotesPage";
import GoToVideoPage from "../youtube/GoToVideoPage";

class Routes extends  React.Component<any, object> {

    public render() {

        return (
                <Switch>
                    <Route path='/' exact={true} component={YoutubeOverview}/>
                    <Route path='/login' component={LoginPage}/>
                    <Route path='/signup' component={SignUpPage}/>
                    <Route path='/settings' component={requireLoggedIn(SettingsPage)}/>
                    <Route path='/contact' component={ContactPage}/>
                    <Route path='/send-reset-password-link' component={ForgotPasswordPage}/>
                    <Route path='/youtube/go-to-video' component={GoToVideoPage}/>
                    <Route path='/reset-password' component={ResetPasswordPage}/>
                    <Route path='/loading' component={Loading}/>
                    <Route path='/youtube/continue-watching' component={requireLoggedIn(ContinueWatchingPage)}/>
                    <Route path='/youtube/notes' component={requireLoggedIn(NotesPage)}/>
                    <Route path='/youtube/channels/:id' component={ChannelPage}/>
                    <Route path='/youtube/categories/:id' component={ChannelCategoryPage}/>
                    <Route path='/youtube/videos/:id' component={VideoPage}/>
                    <Route path='/youtube/tags/:id' component={requireLoggedIn(TagVideosPage)}/>
                    <Route path='/youtube/tags' component={requireLoggedIn(TagPage)}/>
                    <Route component={PageNotFound} />
                </Switch>
        );
    }
}

export default withRouter(Routes);