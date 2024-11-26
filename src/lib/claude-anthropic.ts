import Anthropic from '@anthropic-ai/sdk';

export default async function chatWithClaude(input: string) {
    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY as string
        });

        const msg = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{ role: 'user', content: input }],
        });
        return msg;
    } catch (error) {
        console.error(error);
        throw error;
    }

}


