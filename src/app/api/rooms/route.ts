import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database,Room,Message,User} from "@lib/DB";

export const GET = async () => {
  const rooms = readDB();
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms: rooms.length;
  });
};

export const POST = async (request: NextRequest) => {
  const token =request.headers.get('authorization');
  const payload = checkToken();

  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
     );
  }

  const { roomName } = await request.json();

  readDB();

  const existingRoom = DB.rooms.find(room => room.name === roomName);
  if (existingRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${"replace this with room name"} already exists`,
      },
      { status: 400 }
   );

  }



  const roomId = nanoid();
  const newRoom = {id:roomId, name:roomName, createBy:payload.userId};
  //call writeDB after modifying Database
  DB.rooms.push(newRoom);
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};
