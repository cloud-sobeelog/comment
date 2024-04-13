const createSalt = async() => {
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });
}

const createHashedPassword = async (password) => {
    const salt = await createSalt();
    const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
    const newpassword = key.toString("base64");
  
    return { newpassword, salt };
};
