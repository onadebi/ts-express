import User from "../../users/entity/user.entity";

export default interface IGoal{
    id?: number;
    title: string;
    details: string;
    // userId: number | Users;
}