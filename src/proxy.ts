import { NextResponse, type NextRequest } from 'next/server';

// Match only the public www host; development, preview and the apex bypass this.
export function proxy(request: NextRequest) {
  if (request.headers.get('host')?.toLowerCase().split(':')[0] !== 'www.directlocal.ro') return NextResponse.next();
  const destination = new URL(request.url);
  destination.protocol = 'https:';
  destination.hostname = 'directlocal.ro';
  destination.port = '';
  return NextResponse.redirect(destination, 308);
}
export const config = {
  matcher: [{ source: '/:path*', has: [{ type: 'host', value: 'www.directlocal.ro' }] }],
};
