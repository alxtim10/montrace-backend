const {
  findUsers,
  findUserById,
  createUser,
  updatePassword,
  findUserByEmail,
  findUserByRefreshToken,
  editToken,
  deleteToken,
} = require("./users.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (refreshToken) => {
  const user = await findUserByRefreshToken(refreshToken);

  return user;
};

const getUserById = async (id) => {
  const user = await findUserById(id);

  if (!user) {
    throw Error("User not found.");
  }

  return user;
};

const registerUser = async (newData) => {
  if (newData.email == "" || newData.email == "" || newData.email == "")
    throw Error("Missing fields.");
  const existingUser = await findUserByEmail(newData.email);

  if (existingUser) {
    throw Error("Email already registered.");
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newData.password, salt);
  newData.password = hashPassword;
  const user = await createUser(newData);
  const { id: userId, name, email } = user;
  const accessToken = jwt.sign(
    { userId, name, email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20s",
    }
  );
  const refreshToken = jwt.sign(
    { userId, name, email },
    process.env.REFERSH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const tokenData = {
    accessToken,
    refreshToken,
  };

  return tokenData;
};

const loginUser = async (loginData) => {
  const user = await findUserByEmail(loginData.email);
  if (!user) throw Error("Wrong credentials");
  const match = await bcrypt.compare(loginData.password, user.password);
  if (!match) throw Error("Wrong credentials");

  const { id: userId, name, email } = user;
  const accessToken = jwt.sign(
    { userId, name, email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "20s",
    }
  );
  const refreshToken = jwt.sign(
    { userId, name, email },
    process.env.REFERSH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  await editToken(userId, refreshToken);

  const tokenData = {
    accessToken,
    refreshToken,
  };

  return tokenData;
};

const refreshToken = async (cookieRefreshToken) => {
  const existingUser = await findUserByRefreshToken(cookieRefreshToken);

  if (!existingUser) throw Error("Unauthorized");

  let token = "";
  jwt.verify(
    cookieRefreshToken,
    process.env.REFERSH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) throw Error("Forbidden");

      const userId = existingUser.id;
      const name = existingUser.name;
      const email = existingUser.email;
      const accessToken = jwt.sign(
        { userId, name, email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15s",
        }
      );

      token = accessToken;
    }
  );
  return token;
};

const logoutUser = async (cookieRefreshToken) => {
  if (!cookieRefreshToken) throw Error("Bad Request");
  const existingUser = await findUserByRefreshToken(cookieRefreshToken);
  if (!existingUser) throw Error("Bad Request");

  await deleteToken(existingUser.id);

  return;
};

const changePassword = async (newPasswordData) => {
  const user = await findUserById(newPasswordData.userId);
  if (!user) throw Error("Wrong credentials");
  const match = await bcrypt.compare(newPasswordData.password, user.password);
  if (!match) throw Error("Wrong password");

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newPasswordData.newPassword, salt);
  newPasswordData.password = hashPassword;
  const newUser = await updatePassword(newPasswordData);
  

  return newUser;

};

module.exports = {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  changePassword
};
