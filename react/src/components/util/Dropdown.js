import React, {Component} from 'react'
import classNames from "classnames"
import autobind from 'class-autobind';

export default class Dropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropdownExpanded: false,
            selection: this.props.selection
        };
        autobind(this);
    }

    toggleDropdown(event) {
        console.log("toggle dropdown");
        this.setState({
            dropdownExpanded: !this.state.dropdownExpanded
        });

        event.preventDefault();
    }

    hideDropdown() {
        const that = this;
            that.setState({
                dropdownExpanded: false
            })
    }

    onOptionSelected(event, type) {
        this.hideDropdown();
        console.log("dropdown clicked", type);
        this.setState({selection: type});
        this.props.onOptionSelected(type);
        event.preventDefault();
    }

    renderDropdown() {
        let dropdownContent = classNames("dropdown-menu", {"show": this.state.dropdownExpanded});

        return (
            <div className={dropdownContent} aria-labelledby="dropdownMenuLink">
                {this.props.options.map((key) => {
                    return (<button key={key} onClick={(event) => {
                        this.onOptionSelected(event, key);
                    }} className="dropdown-item">{this.props.getName(key)}</button>);
                })}
            </div>)
    }

    render() {
        let dropdownTitle = classNames("dropdown", {"show": this.state.dropdownExpanded});

        return (
            <div className={dropdownTitle}>
                <button
                    onClick={this.toggleDropdown}
                    className="btn btn-secondary dropdown-toggle" id="dropdownMenuLink" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    {this.props.getName(this.state.selection)}
                </button>

                {this.renderDropdown()}

            </div>
        )
    }
}