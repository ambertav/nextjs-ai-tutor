import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import FlashcardSet from '@/lib/models/flashcard-set';
import Flashcard from '@/lib/models/flashcard';

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
    try {
        await connectToDatabase();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const flashcardSet = await FlashcardSet.findById(id).lean();

        if (!flashcardSet) {
            return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 });
        }

        const flashcards = await Flashcard.find({ cardSet: id }).lean();

        if (flashcards.length === 0) {
            return NextResponse.json({ error: 'No flashcards found in this set' }, { status: 404 });
        }

        return NextResponse.json({ flashcardSet, flashcards });

    } catch (error) {
        console.error('Error fetching flashcards in set:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
