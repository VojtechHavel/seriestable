import * as React from "react";
import autobind from 'class-autobind';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {faAngleRight, faAngleLeft} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleRight, faAngleLeft);
dom.watch();

export interface PaginationProps {
    page: number,
    onPageChange: (page: number)=>void,
    itemCount: number,
    pageSize: number
}

interface PaginationState {
}

export default class Pagination extends React.Component<PaginationProps, PaginationState> {
    constructor(props) {
        super(props);
        autobind(this);

    }

    public render(){
        if ((this.props.page > 0) && (this.lastPage() < (this.props.page + 1))) {
            this.props.onPageChange(0);
        }
        
        return (
            <div className={"pagination row"}>
                <div className={"pagination-child"}>
                    {this.renderPageNumber()}
                    {this.renderPageNavigation()}
                </div>
            </div>
        )
    }


    private renderPageNumber() {
        return <div
            className={"page-number"}>{this.props.page + 1} of {this.lastPage()}</div>

    }

    private renderPageNavigation() {
        return <span className="page-navigation">
                <span className={this.firstPage() ? "inactive" : ""} onClick={this.onPrevPage}>
                    <FontAwesomeIcon icon={"angle-left"}/>
                </span>

                <span className={this.isLastPage() ? "inactive" : ""} onClick={this.onNextPage}>
                    <FontAwesomeIcon
                        icon={"angle-right"}/>
                </span>
            </span>
    }

    private isLastPage(): boolean {
        return this.lastPage() <= (this.props.page + 1)
    }

    private firstPage(): boolean {
        return this.props.page <= 0;
    }

    private onNextPage() {
        if (Math.ceil(this.props.itemCount / this.props.pageSize) > (this.props.page + 1)) {
                this.props.onPageChange(this.props.page + 1);
        }
    }

    private onPrevPage() {
        if ((this.props.page > 0)) {
            this.props.onPageChange(this.props.page - 1);
        }
    }

    private lastPage(): number {


        return Math.ceil(this.props.itemCount / this.props.pageSize);
    }
}