import { DB, readDB, writeDB} from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database,Room,Message,User} from "@lib/DB";


export const GET = async (request: NextRequest) => {
  const { roomId} = request.query;

  readDB();
  const massages = DB.massages.filter(msg => msg.roomId === roomId);

  if (massages.length === 0){
    return NextResponse.json(
      {
         ok: false,
         message: `Room is not found`,
       },
        { status: 404 }
      );
   }
  
    return NextResponse.json({
      ok: true,
      massages,

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
  const { roomId,content } = await request.json();
  readDB();

  

  const messageId = nanoid();
  const newMessages = {
    id: messageId,
    roomId,
    content,
    senderId: payload.userId;
    createdAt: new Data().toISOString(),
  };
  DB.massages.push(newMessages);
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
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
  const { messageId } = await request.json();
  readDB();

  const massagesIndex = DB.massages.findIndex(msg => msg.id === messageId);

  if (massagesIndex === -1){
    eturn NextResponse.json(
      {
       ok: false,
        message: "Message is not found",
      },
       { status: 404 }
     );
  }

  const message = DB.massages[massagesIndex];
  if (payload.userId !== message.senderId && payload.role !== 'SUPER_ADMIN'){
    return NextResponse.json(
      {
        ok: false,
        message: "Uanuthorized to delete message",
      },
      { status: 403}
    );
  }
  DB.massages.splice(messageIndex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
