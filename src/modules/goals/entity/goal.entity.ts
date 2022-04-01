import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import IGoal from '../interfaces/IGoal'
import {MinLength} from 'class-validator'
import { appsettings } from "../../../config/appsettings";
import GoalVariables from "../goal.variables";
import { BaseTableFields } from "../../common/BaseTableFields";
import User from "../../users/entity/user.entity";

@Entity({name: GoalVariables.TableName})
export default class Goal extends BaseTableFields {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length:1000, nullable: false})
    @MinLength(appsettings.GoalsConfig.minGoalsLength,{message:`Goal is a required field and must be more than ${appsettings.GoalsConfig.minGoalsLength} chars long`})
    title!: string;

    @Column({type: 'varchar', nullable: true, default: ()=> null})
    details!: string;

    @Column({type: 'bit',name:'is_completed', default: ()=> 'false'})
    isCompleted!: boolean;

    // Only made true after authorization to delete.
    @Column({type: 'bit',name:'is_deleted', default: ()=> 'false'})
    isDeleted!: boolean;

    @ManyToOne(type=> User, (user)=> user.goals,{nullable: false})
    @JoinColumn({name: 'userId'})
    userId!: User;

    user: any;
}