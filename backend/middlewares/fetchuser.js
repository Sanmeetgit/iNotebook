var jwt = require('jsonwebtoken');
const JWT_SECRET = "sanmeet btech 111903087 coep23";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please Authenticate using valid token!!" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please Authenticate using valid token!!" });
    }
}

module.exports = fetchuser;