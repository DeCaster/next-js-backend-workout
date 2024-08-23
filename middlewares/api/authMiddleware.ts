const validate = (token: any) => {
    const validToken = true;
    if (!validToken || !token) {
        return false;
    }
    return true;
}

// authMiddleware artık sadece tek bir argüman alacak şekilde düzenlendi.
export function authMiddleware(req: Request): any {
    const token = req.headers.get('authorization')?.split(' ')[1];
    return { isValid: validate(token) };
}
