import { EntityRepository, Repository } from "typeorm";
import Users from "../users/models/User";

@EntityRepository()
export class UserRepository extends Repository<Users>{

}