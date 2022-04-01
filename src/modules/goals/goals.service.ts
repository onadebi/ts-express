import { EntityRepository, getRepository, Repository } from "typeorm";
import { appsettings } from "../../config/appsettings";
import GenResponse, { StatusCode } from "../../config/GenResponse";
import GoalVariables from "./goal.variables";
import Goal from "./entity/goal.entity";
import IGoal from "./interfaces/IGoal";
import { CreateGoal } from "./interfaces/create-goal";
import { ConsoleLog } from "../../utils/util-helper";
import { nameOfFactory } from "../../middleware/utils";

@EntityRepository(Goal)
export class GoalsRepository extends Repository<Goal>{
    nameOf = nameOfFactory<Goal>();
    
    CreateGoal =(goal: CreateGoal): Promise<GenResponse<IGoal|null>>=>{
        const objResult = new Promise<GenResponse<IGoal|null>>(async (resolve,reject)=>{
            const isValidGoal = await this._IsValidGoalContent(goal);
            if(!isValidGoal.IsSuccess){
                return resolve(isValidGoal);
            }
            const newGoal = new Goal();
            Object.assign(newGoal,goal);
            newGoal.user = undefined;
            const userRepo = getRepository(Goal);
            ConsoleLog(`Data to be saved to db ${JSON.stringify(newGoal,null,2)}`)
            userRepo.save(newGoal).then((result)=>{
                if(result){
                    return resolve(GenResponse.Result<IGoal>(result, true,StatusCode.Created));
                }
            }).catch((error)=>{
                console.log(`[GoalsRepository][CreateGoal] ERROR:: ${error}`);
                return resolve(GenResponse.Result<IGoal|null>(null,false,StatusCode.ServerError,"An error occured. Kindly try again."));
            });
        }).catch((error)=> {
            console.log(`[GoalsRepository][CreateGoal] ERROR:: ${error}`);
            return GenResponse.Result<IGoal|null>(null,false,StatusCode.ServerError,"An error occured. Kindly try again.");
        })
        return objResult;
    }

    GetAllGoals =async (): Promise<GenResponse<IGoal[]|null>> =>{
        let objResult: GenResponse<IGoal[]| null>;
        try {
            const goalsRepo = getRepository(Goal);
            const allGoals = await goalsRepo.find({where: {isDeleted : 0}})
            if(allGoals && allGoals.length > 0){
                objResult = GenResponse.Result<IGoal[]>(allGoals, true,StatusCode.OK, allGoals.length.toString());
            }
            else{
                objResult = GenResponse.Result<IGoal[]|null>(null, false);
            }
        } catch (error) {
            console.log(`[GoalsRepository][GetAllGoals] ERROR:: ${error}`);
            objResult = GenResponse.Result<IGoal[]|null>(null, false);
        }
        return objResult;
    }

    
    GetGoalsByUsername =async (username: string): Promise<GenResponse<IGoal[]|null>> =>{
        let objResult: GenResponse<IGoal[]| null>;
        try {
            const goalsRepo = getRepository(Goal);
            const allGoals = await goalsRepo.find({where: {isDeleted : 0}})
            const userGoals = await goalsRepo.createQueryBuilder('goals')
            .select([
                `goals.${this.nameOf('id')}`,
                `goals.${this.nameOf('title')}`,
                `goals.${this.nameOf('details')}`,
                `goals.${this.nameOf('isCompleted')}`,
                `goals.${this.nameOf('isDeleted')}`,
                `goals.${this.nameOf('createdAt')}`,
                `goals.${this.nameOf('updatedAt')}`,
            ])
            .innerJoin(`goals.${this.nameOf('user')}`,'user',`goals.${this.nameOf('isDeleted')} = :isDeleted`,{isDeleted: false})
            .getMany();
            if(allGoals && allGoals.length > 0){
                objResult = GenResponse.Result<IGoal[]>(allGoals, true,StatusCode.OK, allGoals.length.toString());
            }
            else{
                objResult = GenResponse.Result<IGoal[]|null>(null, false);
            }
        } catch (error) {
            console.log(`[GoalsRepository][GetAllGoals] ERROR:: ${error}`);
            objResult = GenResponse.Result<IGoal[]|null>(null, false);
        }
        return objResult;
    }


    GetGoalById = async(id:number): Promise<GenResponse<IGoal|null>>=>{
        const objResult = new Promise<GenResponse<IGoal|null>>(async (resolve, reject)=>{
            const result = await this.createQueryBuilder(GoalVariables.TableName)
            .where(`${GoalVariables.TableName}.id = :id`, {id})
            .andWhere(`${GoalVariables.TableName}.is_deleted = 0`).getOne();
            if(result){
                resolve(GenResponse.Result<IGoal|null>(result,true,StatusCode.OK,null))
            }else{
                resolve(GenResponse.Result<IGoal|null>(null,false,StatusCode.NotFound,"Goal not found"))
            }
        }).catch((error)=>{
            console.log(`[GoalsRepository][GetGoalById] ERROR:: ${error}`);
            return GenResponse.Result<IGoal|null>(null,false,StatusCode.ServerError,"Ann error occured")
        });
        return objResult;
    }

    UpdateGoal = async(goal: IGoal,id: number): Promise<GenResponse<IGoal|null>> =>{
        let objResult: GenResponse<IGoal|null> = new GenResponse;
        try {
            const isGoalValid = await this._IsValidGoalContent(goal);
            if(!isGoalValid.IsSuccess){
                objResult = isGoalValid;
            }else{
                goal.id = id;
                const _goalExists = await this._GetRepo().findOne(goal.id);
                if(!_goalExists){
                    return GenResponse.Result<null>(null,false, StatusCode.NotFound,`Goal with id ${goal.id} does not exist.`);
                }else{
                    const updateResult = await this.createQueryBuilder(GoalVariables.TableName).update(Goal).set({
                        details: goal.details
                    }).where(`id= :id`,{id : goal.id}).execute();
                    console.log(JSON.stringify(updateResult,null,2))

                    if(updateResult.affected !== undefined && updateResult.affected > 0)
                    {
                        const newObj = await this._GetRepo().findOne(goal.id);
                        return GenResponse.Result<IGoal>(newObj!, true,StatusCode.OK,null);
                    }else{
                        return GenResponse.Result<null>(null, false,StatusCode.BadRequest,null);
                    }
                }
            }
            
        } catch (error) {
            console.log(`[GoalsRepository][GetAllGoals] ERROR:: ${error}`);
            objResult = GenResponse.Result<IGoal|null>(null, false,StatusCode.ServerError,null);
        }
        return objResult;
    }

    RemoveGoal = async(id: number): Promise<GenResponse<IGoal|null>> =>{
        const goalRepo = this._GetRepo();
        let objResult: GenResponse<null>;
        try {
            const goal = await goalRepo.findOne({where :{id}});
            if(goal){
                if(goal.isDeleted){
                    return GenResponse.Result<null>(null,false,StatusCode.BadRequest,'Goal record not found!')
                }
                goal.isDeleted = true;
                objResult = GenResponse.Result<null>(null, true,StatusCode.OK,'Goal record deleted!');
            }else{
                objResult = GenResponse.Result<null>(null, false,StatusCode.BadRequest,'Goal record not found for deletion!');
            }
        } catch (error) {
            console.log(`[GoalsRepository][GetAllGoals] ERROR:: ${error}`);
            objResult = GenResponse.Result<null>(null, false,StatusCode.ServerError,'Goal record not deleted!');
        }
        return objResult;
    }

    _IsValidGoalContent = async(goal: IGoal | CreateGoal): Promise<GenResponse<IGoal|null>> =>{
        let isGoalValid :GenResponse<IGoal|null>;
        if(goal === null || goal === undefined || !goal.details || goal.details.length < appsettings.GoalsConfig.minGoalsLength){
            isGoalValid = GenResponse.Result<IGoal|null>(null,false, StatusCode.BadRequest,`Goal field is required and must be more than ${appsettings.GoalsConfig.minGoalsLength} chars long`);
        }else{
            isGoalValid = GenResponse.Result<IGoal|null>(null,true, StatusCode.OK,`Goal is valid`);
        }
        return isGoalValid;
    }

    _GetRepo(): Repository<Goal> {
        return getRepository(Goal);
    }
    

}