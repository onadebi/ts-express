import { Column } from "typeorm";

export class BaseTableFields{
    @Column({type: 'timestamp',name:'created_at', nullable:false, default: ()=> 'CURRENT_TIMESTAMP(6)'})
    createdAt!: Date;

    @Column({type:'timestamp', name:'updated_at', nullable:false, default: ()=> 'CURRENT_TIMESTAMP(6)'})
    updatedAt!: Date;

    //Deactivate until second level authorizer confirms for deletion
    @Column({type: 'int',name:'is_active', default: ()=> '1'})
    isActive!: number;

    @Column({type:'boolean', name:'is_deactivated', default: ()=> 'false'})
    isDeactivated!:boolean;

}