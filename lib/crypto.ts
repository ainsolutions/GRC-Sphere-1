import bcrypt from "bcryptjs";

export const hashPwd = (pwd: string) => bcrypt.hash(pwd, 10)
export const verifyPwd = (pwd: string, hash: string) => bcrypt.compare(pwd, hash)


