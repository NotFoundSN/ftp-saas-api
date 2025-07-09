import db from "../models/index.js";

 const User = {
    /*createUser: async (user = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        enabled: 0,
        uuid: "",
    }) => {
        return await db.User.create(user);
    },
    createSecurity: async (security = {
        userID: 0,
        password: null,
        passwordDate: null,
        secureCode: "",
        secureCodeDate: new Date()
    }) => {
        return await db.UserSecurity.create(security);
    },
    findByEmail: async (email = "", password = false) => {
        let other = null;
        if (password) {
            other = {
                includes: [
                    {
                        model: db.UserSecurity,
                    }
                ]
            };
        }
        return await db.User.findOne({ ...other, where: { email } });
    },
    findByUUID: async (uuid = "") => {
        return await db.User.findOne({
            includes: [
                {
                    model: db.UserSecurity,
                }
            ],
            where: { uuid }
        });
    },
    updatePassword: async (userID = 0, password = "") => {
        return await db.UserSecurity.update({ password, passwordDate: new Date(), secureCode: null }, { where: { userID } });
    },
    newCode: async (userID = 0, code = "") => {
        return await db.UserSecurity.update({ secureCode: code, secureCodeDate: new Date() }, { where: { userID } });
    },*/
}

export default User;