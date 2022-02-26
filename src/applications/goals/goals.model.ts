import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import IGoal from './interfaces/IGoal'
import {MinLength} from 'class-validator'
import { appsettings } from "../../config/appsettings";
import GoalVariables from "./goal.variables";
import { BaseTableFields } from "../common/BaseTableFields";
import Users from "../users/users.model";

@Entity({name: GoalVariables.TableName})
export default class Goals extends BaseTableFields implements IGoal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 1000, nullable: false})
    @MinLength(appsettings.GoalsConfig.minGoalsLength,{message:`Goal is a required field and must be more than ${appsettings.GoalsConfig.minGoalsLength} chars long`})
    text!: string;

    @Column({type: 'bit',name:'is_completed', default: ()=> 'false'})
    isCompleted!: boolean;

    // Only made true after authorization to delete.
    @Column({type: 'bit',name:'is_deleted', default: ()=> 'false'})
    isDeleted!: boolean;

    @ManyToOne(type=> Users, (user)=> user.goals,{nullable: false})
    userId!: number| Users;
}