import mongoose from 'mongoose';

export interface IFlashcard extends mongoose.Document {
    question: string;
    answer: string;
    example: string;
    cardSet: mongoose.Types.ObjectId;
}

const flashcardSchema = new mongoose.Schema<IFlashcard>({
    question: { 
        type: String, 
        required: true 
    },
    answer: { 
        type: String, 
        required: true 
    },
    example: { 
        type: String,
        default: '',
    },
    cardSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashcardSet',
        required: true,
      },
}, { timestamps: true });

const Flashcard = mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', flashcardSchema);

export default Flashcard;
