import * as React from 'react';
import "./YoutubeOverview.scss"
import autobind from 'class-autobind';
import "./IconPicker.scss"
import {dom, IconProp, library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faTag,
    faDumbbell,
    faBasketballBall,
    faBook,
    faCamera,
    faChartLine,
    faChartPie,
    faCheck,
    faCode,
    faCoffee,
    faCog,
    faComment,
    faPaw,
    faDna,
    faDollarSign,
    faExclamation,
    faEye,
    faFlagCheckered,
    faGamepad,
    faGraduationCap,
    faInfo,
    faLightbulb,
    faMapSigns,
    faMicrophone,
    faMusic,
    faRocket,
    faStar,
    faTools,
    faTrophy,
    faTv,
    faUtensils,
    faHeart,
    faSquareRootAlt,
    faBriefcaseMedical, faTimes, faMicroscope, faAtom, faGrinAlt, faFilm, faClock, faBell
} from "@fortawesome/free-solid-svg-icons";

library.add(faTag, faBell, faCheck, faLightbulb, faHeart, faStar, faExclamation, faEye,
    faTimes, faMicrophone, faDumbbell, faGraduationCap, faBook, faCamera, faCoffee, faDna,
    faSquareRootAlt, faTv, faBriefcaseMedical, faRocket, faAtom, faFilm, faChartLine, faChartPie,
    faMicroscope, faCog, faComment, faPaw, faGrinAlt, faGamepad, faDollarSign, faCode, faUtensils,
    faTools, faTrophy, faMusic, faMapSigns, faFlagCheckered, faInfo, faBasketballBall, faClock);

dom.watch();

export interface IconPickerProps {
    icon: string,
    onChange: (icon: string, event: any) => any
}

export default class IconPicker extends React.Component<IconPickerProps, {}> {

    private icons: any = [
        ["tag", "check", "times", "lightbulb", "star", "exclamation", "heart"],
        ["info",  "comment", "grin-alt", "clock", "chart-line", "dollar-sign", "graduation-cap"],
        ["music", "tv", "basketball-ball", "microphone", "film", "utensils", "gamepad"],
        ["square-root-alt", "rocket", "atom", "code", "briefcase-medical", "microscope", "dna"],
        ["map-signs", "paw", "flag-checkered", "trophy", "dumbbell", "book", "tools"],
    ];

    constructor(props) {
        super(props);
        autobind(this);
    }

    public render() {
        return (
            <div className={"icon-picker"}>
                {this.icons.map((row) => {
                    return (
                        <div key={JSON.stringify(row) + "Key"} className={"icon-picker-row"}>
                            {row.map((iconString) => {
                                let icon: IconProp = "tag";
                                if (iconString) {
                                    icon = iconString as IconProp
                                }

                                const handleClick = (event) => {
                                    this.props.onChange(iconString, event);
                                };

                                let selectedClass: string = "";
                                if (icon === this.props.icon) {
                                    selectedClass = " selected";
                                }
                                return (
                                    <span onClick={handleClick} key={icon + "Key"}
                                          className={"icon-picker-icon" + selectedClass}>
                                        <FontAwesomeIcon fixedWidth={true} icon={icon}/>
                                    </span>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}