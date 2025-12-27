import { NextResponse } from 'next/server';
import axios from 'axios';

const GAMES_SOURCE_URL = process.env.NEXT_PUBLIC_GAMES_JSON || 'https://www.onlinegames.io/media/plugins/genGames/embed.json';

export async function GET() {
  try {
    const response = await axios.get(GAMES_SOURCE_URL, {
      timeout: 10000,
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API Proxy Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
