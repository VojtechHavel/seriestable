import * as React from "react";
import autobind from 'class-autobind';
import AddFormView from "../util/AddFormView";
import State from "../../types/State";
import Modal from "../util/Modal";
// @ts-ignore
import {toast} from "react-toastify";
import "./AddCategory.scss"

interface AddCategoryState {
    showAddCategoryModal: boolean
}

export interface VideoListProps {
}

interface AddCategoryProps {
    addCategory: (name: string) => any
}

class AddCategory extends React.Component<AddCategoryProps, AddCategoryState> {
    constructor(props) {
        super(props);
        console.log("AddCategory constructor call");
        this.state = {
            showAddCategoryModal: false,
        };
        autobind(this);
    }

    public render() {
        console.log("this.state.showAddCategoryModal", this.state.showAddCategoryModal);

        return (
            <div className={"hover-shadow"}>
                <div onClick={this.handleOpenAddCategoryModal} className={"page-section add-section"}>
                    <h3>Add Category</h3>
                </div>
                <Modal
                    key="AddCategoryModal"
                    onClose={this.handleCloseAddCategoryModal}
                    showModal={this.state.showAddCategoryModal}>
                    <AddFormView
                        placeholder={"Category name"}
                        title={"Add new category for channels"}
                        processing={State.OK}
                        onSubmit={this.addCategory}/>
                </Modal>
            </div>)
    }

    private handleOpenAddCategoryModal() {
        console.log("handleOpenAddCategoryModal");
        this.setState({
            showAddCategoryModal: true
        })
    }

    private handleCloseAddCategoryModal() {
        this.setState({
            showAddCategoryModal: false
        })

    }

    private addCategory(categoryName: string) {
        this.props.addCategory(categoryName).then(() => {
            // toast.success("Category added.");
            this.setState({
                showAddCategoryModal: false
            })
        });
    }
}


export default AddCategory;

