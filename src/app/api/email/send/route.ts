import { sendVerificationCode } from "@/components/server/emailDefender";

export async function POST(req: Request) {
  const { email } = await req.json();

  const result = await sendVerificationCode(email);

  return Response.json(result);
}