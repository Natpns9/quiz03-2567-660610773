import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Panisa Pathapee",
    studentId: "660610773",
  });
};
