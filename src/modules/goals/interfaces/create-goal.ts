import User from "../../users/entity/user.entity";

export interface CreateGoal{
    id?: number;
    title: string;
    details: string;
    userId: User;
}