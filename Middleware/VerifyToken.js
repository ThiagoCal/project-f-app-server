import jwt from "jsonwebtoken";
import User from "../Models/User_model.js";
import dotenv from "dotenv";
dotenv.config();

// export const VerifyToken = (req, res, next) => {
//   const accessToken = req.cookies.accessToken || req.headers['x-acces-token']
//     if(!accessToken) return res.status(401).json({msg: 'Unauthorized Token - Permission Denied'})
//     jwt.verify(accessToken, process.env.ACCESS_TOKEN, async (err, decoded )=>{
//       if(err) return res.status(403).json({msg: 'verify token failed'})

//       req.email = decoded.email
//       req.userid = decoded.userid

//       try{
//         const user = await User.findAll({
//           where:{
//             email: decoded.email
//           }
//         })
//         user.length === 0 ? res.status(403).json({msg: 'verify user failed'}) :
//         next()
//       }catch(e){
//         req.status(403).json({msg: 'verify user failed'})
//       }
//     })
// }

export const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(refreshToken, process.env.SECRETKEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const user = await User.findById(payload.sub);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign({ sub: user.id }, process.env.ACCESS_TOKEN, {
        expiresIn: "15m",
      });

      // Set the access token in the response headers
      res.setHeader("Authorization", `Bearer ${accessToken}`);

      // Set the refresh token cookie with the same options as before
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        domain: "localhost",
        // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  });
};
