import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|ingest|favicon.ico).*)'],
};

export default async function middleware(req: Request) {
  return NextResponse.next();
}
