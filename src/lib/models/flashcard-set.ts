import mongoose from 'mongoose';

export interface IFlashcardSet extends mongoose.Document {
    name: string;
    subject: string;
    topic: string;
    description: string;
}

const flashcardSetSchema = new mongoose.Schema<IFlashcardSet>({
    name: { 
        type: String, 
        required: true,
        unique: true,
    },
    subject: { 
        type: String, 
        required: true 
    },
    topic: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true,
        default: ''
    },
}, { timestamps: true });


export default mongoose.model<IFlashcardSet>('FlashcardSet', flashcardSetSchema);;
