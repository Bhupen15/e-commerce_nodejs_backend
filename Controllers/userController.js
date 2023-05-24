const User = require("./db/user");


export const registerUser= async (req, res) => {


    let user = await User.create(req.body);

    user = user.toObject();
    delete user.password;
    Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send({ result: "Something went wrong, Please try after sometime" });
        }
        res.send({ user, auth: token });
    })


}
