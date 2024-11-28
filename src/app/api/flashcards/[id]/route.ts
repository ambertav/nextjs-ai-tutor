import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import FlashcardSet from '@/lib/models/flashcard-set';
import Flashcard from '@/lib/models/flashcard';


// note: issue with typing per Vercel, was not successful with either @ts-ignore or @ts-expect-error
export async function GET(req: NextRequest /* { params }: { params: { id: string } } */) {
    try {
        // const { id } = await params;


        // accessing id via url rather than params due to issue noted above
        const url = new URL(req.url);
        const id = url.pathname.split('/')[3];

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
