import { NextResponse } from 'next/server';
import chatWithClaude from '@/lib/claude-anthropic';
import connectToDatabase from '@/lib/mongodb';
import FlashcardSet from '@/lib/models/flashcard-set';
import Flashcard from '@/lib/models/flashcard';

export interface IToolResponse {
    subject: string;
    topic: string;
    name: string;
    flashcards: [{
        question: string;
        answer: string;
        example?: string;
    }]
}

export async function POST(request: Request) {
    try {
        const { input } = await request.json();
        const { msg, toolResponse } = await chatWithClaude(input);

        let setId : string = '';

        if (toolResponse) {
            const flashcardSet = await createFlashcards(toolResponse);
            setId = flashcardSet._id;
        }

        return NextResponse.json({ msg: msg.content[0].text, setId });

    } catch (error) {
        console.error('Error messaging Claude:', error);
        return NextResponse.json(
            { error: 'Failed message with Claude' },
            { status: 500 }
        );
    }
}

async function createFlashcards (toolResponse : IToolResponse) {
    try {
        await connectToDatabase();
    
        const { flashcards, ...setInfo } = toolResponse;
    
        const flashcardSet = await FlashcardSet.create({
            ...setInfo
        });
    
        const flashcardsToCreate = flashcards.map((card) => ({
            ...card,
            cardSet: flashcardSet._id,
        }));

        await Flashcard.insertMany(flashcardsToCreate);

        return flashcardSet._id;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}