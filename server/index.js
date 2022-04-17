import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import client from "@prisma/client";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import { env } from "process"
dotenv.config();

const { PrismaClient } = client;

const app = express();
const db = new PrismaClient();
const JWT_SECRET = env.JWT_SECRET;
const EMAIL = env.ZOHOEMAIL;
const PWD = env.ZOHOPWD;
const API_URL = "http://trecker.vercel.app";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PWD
  }
});
// Outware
async function checkUser(email) {
  const query = {};
  query.email = email;

  return await db.user.findUnique({ where: query });
}
async function addUser(email, firstname, lastname, image, passwordHash) {
  const user = await db.user.create({
    data: { firstname, lastname, email, image, passwordHash },
  });
  return user;
}
async function checkFullUser(user) {
  return await db.user.findUnique({ where: { id: user.id } });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// POST
app.post("/login/", async (req, res) => {
  let status = "OK";
  let message = "";
  let statusCode = 200;

  res.append("Content-Type", "application/json");
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password);
  const user = await checkUser(email);
  if (user) {
    const passwordMatched = await compare(password, user.passwordHash);
    if (passwordMatched) {
      let newuser = user;
      delete newuser.passwordHash;
      const token = jwt.sign({ user: newuser }, JWT_SECRET, {
        expiresIn: "30d",
      });
      status = "OK";
      message = { token, user: newuser };
      statusCode = 200;
    } else {
      status = "BAD";
      message = "email or password is wrong";
      statusCode = 409;
    }
  } else {
    status = "BAD";
    message = "email or password is wrong";
    statusCode = 409;
  }

  res.status(statusCode).json({ status, message });
});
app.post("/user/", async (req, res) => {
  let status = "OK";
  let message = "";
  let statusCode = 200;

  res.append("Content-Type", "application/json");

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const password = req.body.password;
  const email = req.body.email;
  const image = req.body.image;
  const user = await checkUser(email);
  if (user) {
    status = "BAD";
    message = "User already exists";
    statusCode = 409;
  } else {
    status = "OK";
    statusCode = 200;
    message = "";
  }
  if (status === "OK") {
    const hashedPassword = await hash(password, 10);
    const user = await addUser(
      email,
      firstname,
      lastname,
      image,
      hashedPassword
    );
    if (user) {
      status = "OK";
      message = "user created successfly";
      statusCode = 200;
    } else {
      status = "BAD";
      message = "an error occured while creating the user";
      statusCode = 500;
    }
  }

  res.status(statusCode).json({ status, message });
});

app.post("/todo/", isAuth, async (req, res, next) => {
  res.append("Content-Type", "application/json");

  const user = req.user;
  const title = req.body.title;
  const content = req.body.content;
  const dueDate = req.body.dueDate;

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }

  const todo = await db.todo.create({
    data: {
      title,
      content,
      dueDate: new Date(dueDate).toISOString(),
      userId: user.id,
      checked: false,
    },
  });

  if (todo) {
    db.user.update({
      where: {
        id: user.id,
      },
      data: {
        todos: {
          connect: {
            id: todo.id,
          },
        },
      },
    });
  } else {
    res.status(500).json({
      status: "BAD",
      message: "an error occured while creating a todo",
    });
  }

  res.json(todo);
});

// DELETE
app.delete("/todo", isAuth, async (req, res, next) => {
  const user = req.user;
  const todoId = req.body.todoId;

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }
  if (todoId) {
    await db.todo.delete({
      where: {
        id: todoId,
      },
    });
  } else {
    res.status(500).json({
      status: "BAD",
      message: "an error occured while deleting a todo",
    });
    return;
  }

  res.json({ status: "OK", message: "todo was deleted successfly" });
});

app.delete("/me", isAuth, async (req, res, next) => {
  const user = req.user;
  res.append("Content-Type", "application/json");

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }

  if (await db.user.delete({ where: { id: user.id } })) {
    res.status(200).json({ status: "OK", message: "user deleted successfly" });
  } else {
    res
      .status(500)
      .json({ status: "BAD", message: "an error occured while deleting user" });
  }
});

// UPDATE
app.post("/update/me", isAuth, async (req, res, next) => {
  const user = req.user;
  res.append("Content-Type", "application/json");

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const image = req.body.image;

  const newuser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstname,
      lastname,
      email,
      image,
    },
  });

  res.json(newuser);
});
app.post("/update/todo", isAuth, async (req, res, next) => {
  const user = req.user;
  res.append("Content-Type", "application/json");

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }
  console.log(req.body);
  const todoId = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const dueDate = req.body.dueDate;
  const checked = req.body.checked;
  if (!(await db.todo.findUnique({ where: { id: todoId } }))) {
    res.json({ status: "BAD", message: "todo doesn't exist" });
    return;
  }
  const todo = await db.todo.update({
    where: {
      id: todoId,
    },
    data: {
      title,
      content,
      dueDate: new Date(dueDate).toISOString(),
      checked: checked,
    },
  });

  res.json(todo);
});

// Custom Middleware
function isAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ status: "BAD", message: "missing Authorization header" });
  }
  let auth = req.headers.authorization;
  let token = auth.split(" ")[1];
  let jwtData;
  try {
    jwtData = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(401).json({ status: "BAD", message: "invalid token" });
  }
  req.user = jwtData.user;
  next();
}

// GET
app.get("/me", isAuth, async (req, res, next) => {
  const user = req.user;
  res.append("Content-Type", "application/json");

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }
  let nuser = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      todos: true,
    },
  });
  delete nuser.passwordHash;
  delete nuser.passwordReset;
  res.json(nuser);
});
app.get("/todo/:id/", isAuth, async (req, res, next) => {
  const user = req.user;
  res.append("Content-Type", "application/json");

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }

  const todoId = req.params.id;
  const todo = await db.todo.findUnique({ where: { id: todoId } });
  if (todo.userId === user.id) {
    res.json(todo);
  } else {
    res.json();
  }
});
app.post("/reset", async (req, res, next) => {
  const query = { status: "", message: "" };
  const email = req.body.email;
  if (!email) {
    res.json({ status: "BAD", message: "you missed one of the options" })
    return;
  }
  const user = await db.user.findUnique({ where: { email } })
  res.append("Content-Type", "application/json");

  if (!(await checkFullUser(user))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }
  var code = crypto.randomBytes(256).toString("base64url");
  const reseturl = new URL("/resetpassword/", API_URL).href;

  var url = new URL(code, reseturl).href;
  if (await db.passwordReset.findUnique({
    where: {
      userId: user.id
    }
  })) {
    await db.passwordReset.delete({ where: { userId: user.id } })
  }
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordReset: {
        create: {
          code,
          validDate: new Date(
            new Date().getTime() + 60 * 5 * 1000
          ).toISOString(),
        },
      },
    },
  });
  var mailOptions = {
    from: EMAIL,
    to: user.email,
    subject: "You've requested a password reset",
    html: `<div style="width: 100%; height: 100%; background-color: #fafafa;">
    <p>Hi, <strong> ${user.firstname} </strong></p>
    <p>you have requested to reset your password, to do so click the button below or the link</p>
    <p align="center"><a href="${url}"><button style="border: 0; outline: 0; padding: 10px; border-radius: 8px; background-color: #444; color: white; font-family: Cairo,Roboto; cursor: pointer; width: 100px;"> Reset </button></a></p>
    <br /><br /><a href="${url}"> ${url} </a>
    <p>Please note that the link is only valid for 5 minutes</p>
    <p>If that wasn't you, just ignore this message.</p>
    <p>Brian Polier from Terker.</p>
    </div>`,
  };
  console.log(mailOptions);
  await transporter.sendMail(mailOptions, (err, _info) => {
    console.log(_info);
    if (err) {
      query.status = "BAD";
      query.message = "an error occured while trying to send an e-mail";
    }
  });
  query.status = "OK";
  query.message = "e-mail sent successfly";
  res.json(query);

});
app.post("/resetpwd/:tokenid", async (req, res, next) => {
  res.append("Content-Type", "application/json");
  const tokenid = req.params.tokenid;
  console.log(tokenid);
  const pr = await db.passwordReset.findUnique({ where: { code: tokenid } })
  const pwd = req.body.newpassword;
  if (!pwd) {
    res.json({ status: "BAD", message: "one of the arguments is missing" })
    return;
  }

  if (!pr) {
    res.json({ status: "BAD", message: "the token is invalid" });
    return;
  }
  const query = { status: "", message: "" };
  var user = "";
  if (!(user = await checkFullUser({ id: pr.userId }))) {
    res.json({ status: "BAD", message: "user doesn't exist" });
    return;
  }


  if (pr) {
    if (new Date(pr.validDate) > new Date()) {
      if (
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordHash: await hash(pwd, 10),
          },
        })
      ) {
        query.status = "OK";
        query.message = "password changed successfly";
      } else {
        query.status = "BAD";
        query.message = "an error occured while changing the password";
      }
    } else {
      query.status = "BAD";
      query.message = "this link isn't valid";
    }
  } else {
    query.message = "this link isn't valid";
    query.status = "BAD";
  }
  await db.passwordReset.delete({ where: { code: tokenid } })

  res.json(query);
});

app.listen(env.PORT || 8080, () => {
  console.log("Listening...");
});
