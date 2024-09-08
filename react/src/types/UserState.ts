import State from "./State";
import {User} from "./generatedTypes";

export interface UserState extends User{
    state: State
}