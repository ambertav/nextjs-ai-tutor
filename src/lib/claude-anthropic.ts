import Anthropic from '@anthropic-ai/sdk';

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


const FLASHCARD_PATTERNS = [
    /(?:create|make|generate) flashcards? (?:for|about|on) (.+)/i,
    /(?:create|make|generate) (?:some|a set of) flashcards? (?:for|about|on) (.+)/i,
    /flashcards? (?:for|about|on) (.+)/i,
    /help me study (.+) with flashcards/i,
    /i want to study (.+) with flashcards/i
];

function shouldGenerateFlashcards(input: string): { should: boolean; topic?: string } {
    for (const pattern of FLASHCARD_PATTERNS) {
        const match = input.match(pattern);
        if (match) {
            return { should: true, topic: match[1].trim() };
        }
    }
    return { should: false };
}

export default async function chatWithClaude(input: string) {
    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY as string
        });

        const { should: shouldGenerate, topic } = shouldGenerateFlashcards(input);

        const msg = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{ role: 'user', content: input }],
            ...(shouldGenerate && {
                tools:
                [
                    {
                        name: "create_flashcard_set",
                        description: "Generate educational flashcards for studying a specific topic",
                        input_schema: {
                            type: "object",
                            properties: {
                                subject: {
                                    type: "string",
                                    description: "The main subject area"
                                },
                                topic: {
                                    type: "string",
                                    description: "The specific topic within the subject"
                                },
                                name: {
                                    type: "string",
                                    description: "Name for this flashcard set"
                                },
                                flashcards: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            question: {
                                                type: "string",
                                                description: "The question for the flashcard"
                                            },
                                            answer: {
                                                type: "string",
                                                description: "The answer to the question"
                                            },
                                            example: {
                                                type: "string",
                                                description: "Optional example to illustrate the concept"
                                            }
                                        },
                                        required: ["question", "answer"]
                                    }
                                }
                            },
                            required: ["subject", "topic", "name", "description", "flashcards"]
                        }
                    }
                ]
            })
        });

        let toolResponse : IToolResponse | null = null;
        if (shouldGenerate && msg.content[1].type === 'tool_use') {
            toolResponse = msg.content[1].input as IToolResponse;
        }

        return { msg, toolResponse };

    } catch (error) {
        console.error(error);
        throw error;
    }
}