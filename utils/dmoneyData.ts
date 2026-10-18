import { faker } from '@faker-js/faker';
import { generateRandomNumber } from './randomNumber';

export const ADMIN = { email: "admin@dmoney.com", password: "1234" };
export const SYSTEM = { email: "system@dmoney.com", password: "1234" };

export const CUSTOMER_PHONE = "01827464816";

export interface AgentData{
    name:string,
    email:string,
    password:string,
    newPassword:string,
    phone:string,
    nid:string,
}

export function createAgentData():AgentData{
    const firstName=faker.person.firstName();
    const lastName=faker.person.lastName();
    const randomId=generateRandomNumber(10000000,99999999);

    return {
        name:`${firstName} ${lastName}`,
        email:`${firstName}.${lastName}${randomId}@gmail.com`.toLowerCase(),
        password:"1234",
        newPassword:"4321",
        phone:`019${randomId}`,
        nid:`${generateRandomNumber(1000000000,9999999999)}`,
    }
}

export function formatDate(daysAgo=0):string{
    const date=new Date();
    date.setDate(date.getDate()-daysAgo);
    const month=String(date.getMonth()+1).padStart(2,"0");
    const day=String(date.getDate()).padStart(2,"0");
    return `${date.getFullYear()}-${month}-${day}`;
}

export function todayDate():string{
    return formatDate(0);
}
