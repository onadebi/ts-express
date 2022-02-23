import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import IGoal from './interfaces/IGoal'
import {MinLength} from 'class-validator'
import { appsettings } from "../../config/appsettings";
import GoalVariables from "./goal.variables";

@Entity({name: GoalVariables.goalTableName})
export default class Goals implements IGoal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 1000, nullable: false})
    @MinLength(appsettings.GoalsConfig.minGoalsLength,{message:`Goal is a required field and must be more than ${appsettings.GoalsConfig.minGoalsLength} chars long`})
    text!: string;    
    
    @CreateDateColumn({type: "timestamp", default: ()=> 'CURRENT_TIMESTAMP(6)'})
    created_at!: Date;

    @UpdateDateColumn({type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)'})
    updated_at!: Date;

    //Deactivate until second level authorizer confirms for deletion
    @Column({type: 'int',name:'is_active', default: ()=> '1'})
    isActive!: number;

    //Only made true after authorization to delete
    @Column({type: 'bit',name:'is_deleted', default: ()=> 'false'})
    isDeleted!: boolean;
}