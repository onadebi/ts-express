import { isEmail } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { BaseTableFields } from "../common/BaseTableFields";
import Goals from "../goals/goals.model";
import { Gender } from "./models/gender";

@Entity({name:'user'})
class Users extends BaseTableFields {

    constructor(){
        super();
        this.recoveryEmail = this.email;
    }

    @PrimaryGeneratedColumn()
    userid!: number;

    @Column({type: 'varchar', length:50, nullable:false, unique:true})
    username!: string;

    @Column({type: 'varchar', length:100, nullable:false, unique:true})
    email!: string;

    @Column({type: 'varchar', length:100, name:'recovery_email'})
    recoveryEmail!: string;

    @Column({type: 'varchar', length:100, nullable:false})
    password!: string;

    @Column({type:'nvarchar', length:100,nullable: false})
    firstName!: string;

    @Column({type:'nvarchar', length:100,nullable: true})
    middleName!: string;

    @Column({type:'nvarchar', length:100,nullable: false})
    lastName!: string;

    @Column({type:'date'})
    dob?: Date;

    @Column({type:'varchar', length:20, default:()=> `'${Gender.NotSpecified}'`})
    gender!: Gender;

    @Column({name:'contact_address'})
    contactAddress!: string;

    @Column({name:'mobile_phone'})
    mobilephone!: string;

    @Column({type:'boolean', name:'is_validated', default: ()=> 'false'})
    isValidated!:boolean;

    @Column({type:'boolean', name:'is_blocked', default: ()=> 'false'})
    isBlocked!:boolean;

    @OneToMany(type=> Goals,(goals: Goals)=> goals.userId,{eager:true})
    goals?: Goals[];

}

export default Users;