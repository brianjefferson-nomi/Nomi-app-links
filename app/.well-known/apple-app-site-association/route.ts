import { NextResponse } from 'next/server';

export async function GET() {
  const applinks = {
    "applinks": {
      "details": [
        {
          "appID": "2JG6DCN47D.app.rork.nomi",
          "paths": ["*"]
        }
      ]
    }
  };

  return new NextResponse(JSON.stringify(applinks), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
