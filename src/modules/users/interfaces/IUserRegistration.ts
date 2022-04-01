
export interface IUserRegistration extends IUserLogin{
    firstName: string;
    lastName: string;
    email: string;
}

export interface IUserLogin{
    username: string;
    password: string;
}