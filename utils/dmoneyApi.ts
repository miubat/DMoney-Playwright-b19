import { request } from '@playwright/test';
import { ADMIN } from './dmoneyData';

const API_URL="https://dmoney.roadtocareer.net";

export async function getUserByEmail(email:string){
    const api=await request.newContext({ baseURL: API_URL });

    const loginRes=await api.post("/user/login", { data: { email: ADMIN.email, password: ADMIN.password } });
    const { token }=await loginRes.json();

    const userRes=await api.get(`/user/search/email/${encodeURIComponent(email)}`, {
        headers: { Authorization: `bearer ${token}` },
    });
    const { user }=await userRes.json();
    await api.dispose();
    return user;
}

export async function getOtp(email:string):Promise<string>{
    const user=await getUserByEmail(email);
    return user.otp;
}

export async function getResetToken(email:string):Promise<string>{
    const user=await getUserByEmail(email);
    return user.reset_token;
}
