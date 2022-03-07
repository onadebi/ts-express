import Users from "../../users/users.model";

export default interface IGoal{
    id?: number;
    text: string;
    userId: number | Users;
}