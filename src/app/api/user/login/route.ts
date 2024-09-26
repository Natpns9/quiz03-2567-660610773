import jwt from "jsonwebtoken";

import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { User} from "@lib/DB";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
export const POST = async (request: NextRequest) => {
  readDB();

  const { username,password} = await request.json();

  const user = DB.users.find(user => user.username === username&&user.password === password);

  if (!user ){
    return NextResponse.json(
      {
       ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }


  const token = "Replace this with token creation";

  return NextResponse.json({ ok: true, token });
};
