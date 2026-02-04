export function isEqualsPassword(pass1:string, pass2:string) {
    return pass1 === pass2;
}

export function isCorrectPassword(pass:string) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-]).+$/;
    return regex.test(pass);
}

export function isCorrectPassLength(pass:string) {
    return pass.length > 6 && pass.length < 26;
}

export function isCorrectLogin(login:string) {
    const regex = /[a-zA-Z0-9_-]+/;
    return regex.test(login);
}

export function isCorrectLoginLength(login:string) {
    return login.length > 2 && login.length < 21;
}

export async function isFreeLogin(login:string) {
    const isFree = await fetch('/');
    return isFree;
}

export function isCorrectEmail(email:string) {
    const regex = /a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    return regex.test(email);
}

export async function isFreeEmail(email:string) {
    const isFree = await fetch('/');
    return isFree;
}