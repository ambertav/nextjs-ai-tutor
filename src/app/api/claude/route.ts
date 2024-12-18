import { NextResponse, NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import chatWithClaude from '@/lib/claude-anthropic';
import connectToDatabase from '@/lib/mongodb';
import FlashcardSet from '@/lib/models/flashcard-set';
import Flashcard from '@/lib/models/flashcard';
import { IToolResponse } from '@/lib/claude-anthropic';

export async function POST(req: NextRequest) {
    try {
        const { input } = await req.json();
        const { msg, toolResponse }: { msg: Anthropic.Messages.Message, toolResponse: IToolResponse | null } = await chatWithClaude(input);

        let setId: string = '';

        if (toolResponse) {
            const flashcardSet = await createFlashcards(toolResponse);
            setId = flashcardSet._id;
        }

        return NextResponse.json({ msg: (msg.content[0] as Anthropic.TextBlock).text, setId });

    } catch (error) {
        console.error('Error messaging Claude:', error);
        return NextResponse.json(
            { error: 'Failed message with Claude' },
            { status: 500 }
        );
    }
}

async function createFlashcards(toolResponse: IToolResponse) {
    let flashcardSetId: string | null = null;

    try {
        await connectToDatabase();

        const { flashcards, ...setInfo } = toolResponse;

        const flashcardSet = await FlashcardSet.create({
            ...setInfo
        });

        flashcardSetId = flashcardSet._id;

        const flashcardsToCreate = flashcards.map((card) => ({
            ...card,
            cardSet: flashcardSet._id,
        }));

        await Flashcard.insertMany(flashcardsToCreate);

        return flashcardSet._id;

    } catch (error) {
        if (flashcardSetId) {
            await FlashcardSet.deleteOne({ _id: flashcardSetId });
            console.log(`Flashcard set ${flashcardSetId} deleted due to batch creation failure.`);
        }

        console.error(error);
        throw error;
    }
}