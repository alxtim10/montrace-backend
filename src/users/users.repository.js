const prisma = require("../db");

const findUsers = async () => {
    const users = await prisma.users.findMany();
  
    return users;
  };

  const findUserById = async (id) => {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });
  
    return user;
  };

  const findUserByEmail = async (email) => {
    const user = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
  
    return user;
  };
  
  const createUser = async (data) => {
    const user = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return user;
  };

  const updatePassword = async (data) => {
    const user = await prisma.users.update({
      where: {
        id: parseInt(data.userId),
      },
      data: {
        password: data.password,
      },
    });
    return user;
  };

  const findUserByRefreshToken = async (data) => {
    const user = await prisma.users.findFirst({
      where: {
        refreshToken: data
      },
    });

    return user;
  };

  const editToken = async (id, data) => {
    const user = await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        refreshToken: data,
      },
    });
  
    return user;
  };

  const deleteToken = async (id) => {
    const user = await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        refreshToken: null,
      },
    });
  
    return user;
  };

  module.exports = {
    findUsers,
    findUserById,
    findUserByEmail,
    findUserByRefreshToken,
    createUser,
    updatePassword,
    editToken,
    deleteToken
  };
  