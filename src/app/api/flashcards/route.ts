import { NextResponse } from 'next/server';
import FlashcardSet from '@/lib/models/flashcard-set';
import connectToDatabase from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const aggregatedFlashcardSets = await FlashcardSet.aggregate([
            // Step 1: Group by subject and topic
            {
                $group: {
                    _id: {
                        subject: '$subject',
                        topic: '$topic'
                    },
                    flashcardSets: {
                        // includes flashcardSets name and _id to generate links
                        $push: {
                            name: '$name',
                            _id: '$_id'
                        }
                    },
                },
            },
            // Step 2: Sort topics alphabetically within each subject
            {
                $sort: {
                    '_id.subject': 1,
                    '_id.topic': 1
                },
            },
            // Step 3: Group by subject and format it to contain topics and flashcard sets
            {
                $group: {
                    _id: '$_id.subject',
                    topics: {
                        $push: {
                            topic: '$_id.topic',
                            flashcardSets: '$flashcardSets'
                        },
                    },
                },
            },
            // Final Sort: Sort the subjects alphabetically
            {
                $sort: {
                    '_id': 1,
                },
            },
        ]);

        return NextResponse.json(aggregatedFlashcardSets);

    } catch (error) {
        console.error('Error creating flashcard set:', error);
        return NextResponse.json(
            { error: 'Failed to create flashcard set and flashcards' },
            { status: 500 }
        );
    }
}