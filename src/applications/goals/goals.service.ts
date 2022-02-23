import { EntityRepository, getRepository, Repository } from "typeorm";
import { appsettings } from "../../config/appsettings";
import GenResponse, { StatusCode } from "../../config/GenResponse";
import GoalVariables from "./goal.variables";
import Goals from "./goals.model";
import IGoal from "./interfaces/IGoal";

@EntityRepository(Goals)
export class GoalsRepository extends Repository<Goals>{
    
    
    CreateGoal =(goal: IGoal): Promise<GenResponse<IGoal|null>>=>{
        const objResult = new Promise<GenResponse<IGoal|null>>(async (resolve,reject)=>{
            const isValidGoal = await this._IsValidGoalContent(goal);
            if(!isValidGoal.IsSuccess){
                return resolve(isValidGoal);
            }
            const newGoal = new Goals();
            newGoal.text = goal.text;
            const userRepo = getRepository(Goals);
            const result  = await userRepo.save(goal);
            if(result){
                return resolve(GenResponse.Result<IGoal>(result, true,StatusCode.ServerError));
            }
        }).catch((error)=> {
            console.log(`[UserRepository][CreateGoal] ERROR:: ${error}`);
            return GenResponse.Result<IGoal|null>(null,false,StatusCode.ServerError,"An error occured. Kindly try again.");
        })
        return objResult;
    }

    GetAllGoals =async (): Promise<GenResponse<IGoal[]|null>> =>{
        let objResult: GenResponse<IGoal[]| null>;
        try {
            const goalsRepo = getRepository(Goals);
            const allGoals = await goalsRepo.find({where: {isDeleted : 0}})
            if(allGoals && allGoals.length > 0){
                objResult = GenResponse.Result<IGoal[]>(allGoals, true,StatusCode.OK, allGoals.length.toString());
            }
            else{
                objResult = GenResponse.Result<IGoal[]|null>(null, false);
            }
        } catch (error) {
            console.log(`[UserRepository][GetAllGoals] ERROR:: ${error}`);
            objResult = GenResponse.Result<IGoal[]|null>(null, false);
        }
        return objResult;
    }


    GetGoalById = async(id:number): Promise<GenResponse<IGoal|null>>=>{
        const objResult = new Promise<GenResponse<IGoal|null>>(async (resolve, reject)=>{
            const result = await this.createQueryBuilder(GoalVariables.goalTableName)
            .where(`${GoalVariables.goalTableName}.id = :id`, {id})
            .andWhere(`${GoalVariables.goalTableName}.is_deleted = 0`).getOne();
            if(result){
                resolve(GenResponse.Result<IGoal|null>(result,true,StatusCode.OK,null))
            }else{
                resolve(GenResponse.Result<IGoal|null>(null,false,StatusCode.NotFound,"Goal not found"))
            }
        }).catch((error)=>{
            console.log(`[UserRepository][GetGoalById] ERROR:: ${error}`);
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
                    const updateResult = await this.createQueryBuilder(GoalVariables.goalTableName).update(Goals).set({
                        text: goal.text
                    }).where(`id= :id`,{id : goal.id}).execute();
                    console.log(JSON.stringify(updateResult,null,2))

                    if(updateResult.affected !== undefined && updateResult.affected > 0)
                    {
                        const newObj = await this._GetRepo().findOne(goal.id);
                        return GenResponse.Result<IGoal>(newObj!, true,StatusCode.OK,null);
                    }else{
                        return GenResponse.Result<null>(null, false,StatusCode.NoChanges,null);
                    }
                }
            }
            
        } catch (error) {
            console.log(`[UserRepository][GetAllGoals] ERROR:: ${error}`);
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
                    return GenResponse.Result<null>(null,false,StatusCode.NoChanges,'Goal record not found!')
                }
                goal.isDeleted = true;
                objResult = GenResponse.Result<null>(null, true,StatusCode.OK,'Goal record deleted!');
            }else{
                objResult = GenResponse.Result<null>(null, false,StatusCode.NoChanges,'Goal record not found for deletion!');
            }
        } catch (error) {
            console.log(`[UserRepository][GetAllGoals] ERROR:: ${error}`);
            objResult = GenResponse.Result<null>(null, false,StatusCode.ServerError,'Goal record not deleted!');
        }
        return objResult;
    }

    _IsValidGoalContent = async(goal: IGoal): Promise<GenResponse<IGoal|null>> =>{
        let isGoalValid :GenResponse<IGoal|null>;
        if(goal === null || goal === undefined || !goal.text || goal.text.length < appsettings.GoalsConfig.minGoalsLength){
            isGoalValid = GenResponse.Result<IGoal|null>(null,false, StatusCode.BadRequest,`Goal field is required and must be more than ${appsettings.GoalsConfig.minGoalsLength} chars long`);
        }else{
            isGoalValid = GenResponse.Result<IGoal|null>(null,true, StatusCode.OK,`Goal is valid`);
        }
        return isGoalValid;
    }

    _GetRepo(): Repository<Goals> {
        return getRepository(Goals);
    }
    

}