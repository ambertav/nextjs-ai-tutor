import { NextResponse } from 'next/server';
import chatWithClaude from '@/lib/claude-anthropic';

export async function POST(request: Request) {
    try {
        const { input } = await request.json();
        const response = await chatWithClaude(input);
        return NextResponse.json(response.content[0]);

    } catch (error) {
        console.error('Error messaging Claude:', error);
        return NextResponse.json(
            { error: 'Failed message with Claude' },
            { status: 500 }
        );
    }
}