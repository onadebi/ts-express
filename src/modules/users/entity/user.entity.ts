import { IsEmail, isEmail, IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { BaseTableFields } from "../../common/BaseTableFields";
import Goal from "../../goals/entity/goal.entity";
import { Gender } from "../models/gender";

@Entity({name:'user'})
class User extends BaseTableFields {

    constructor(){
        super();
        this.recoveryEmail = this.email;
    }

    @PrimaryGeneratedColumn()
    userid!: number;

    @Column({type: 'varchar', length:50, nullable:false, unique:true})
    username!: string;

    @Column({type: 'varchar', length:100, nullable:false, unique:true})
    @IsEmail()
    email!: string;

    @Column({type: 'varchar', length:100, name:'recovery_email', nullable: true})
    recoveryEmail!: string;

    @Column({type: 'varchar', length:100, nullable:false})
    @IsNotEmpty()
    password!: string;

    @Column({type:'nvarchar', length:100,nullable: false})
    @IsNotEmpty()
    firstName!: string;

    @Column({type:'nvarchar', length:100,nullable: true})
    middleName!: string;

    @Column({type:'nvarchar', length:100,nullable: false})
    @IsNotEmpty()
    lastName!: string;

    @Column({type:'date', nullable:true})
    dob?: Date;

    @Column({type:'varchar', length:20, default:()=> `'${Gender.NotSpecified}'`})
    gender!: Gender;

    @Column({name:'contact_address', nullable:true})
    contactAddress!: string;

    @Column({name:'mobile_phone', nullable:true})
    mobilephone!: string;

    @Column({type:'boolean', name:'is_validated', default: ()=> 'false'})
    isValidated!:boolean;

    @Column({type:'boolean', name:'is_blocked', default: ()=> 'false'})
    isBlocked!:boolean;

    @OneToMany(type=> Goal,(goals: Goal)=> goals.userId,{eager:true})
    goals?: Goal[];

}

export default User;