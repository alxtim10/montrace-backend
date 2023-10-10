const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  changePassword,
} = require("./users.service.js");

router.get("/", async (req, res) => {
  const token = req.cookies.refreshToken;
  const user = await getUsers(token);
  res.send(user);
});

router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserById(userId);

    res.send(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    const user = await registerUser(newUser);

    // res.cookie('refreshToken', user.refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000
    // });

    res.send({
      message: "User data Created.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const loginData = req.body;
    const tokenData = await loginUser(loginData);

    res.cookie("refreshToken", tokenData.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.send({
      accessToken: tokenData.accessToken,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const accessToken = await refreshToken(token);

    res.send({
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(403).send(error.message);
  }
});

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    await logoutUser(token);

    res.clearCookie("refreshToken");
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/password", async (req, res) => {
  try {
    const newUser = await changePassword(req.body);

    res.send({
      data: newUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
