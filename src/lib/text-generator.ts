import type { Settings } from '@/contexts/SettingsContext';

const texts = {
    random: {
        easy: "apple house train cat dog run jump play happy sun blue tree water book read write walk fast slow big small good bad time day man woman life child friend family school food car home art war",
        medium: "computer keyboard mouse screen code develop program language library framework component style layout design color theme mode practice improve typing speed accuracy performance history chart leaderboard profile settings guest session streak achievement progress challenge exercise lesson custom sentence paragraph quote word random generate online modern beautiful responsive accessible interactive intuitive minimalist pastel lavender",
        hard: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! 1234567890 !@#$%^&*()_+-=[]{}\|;:'\",./<>? The Constitution of the United States guarantees certain fundamental rights to its citizens, including freedom of speech, religion, and the press. It establishes a system of checks and balances among the executive, legislative, and judicial branches of government, ensuring no single branch becomes too powerful."
    },
    quotes: {
        easy: "The only way to do great work is to love what you do. How wonderful it is that nobody need wait a single moment before starting to improve the world. The journey of a thousand miles begins with a single step. It is never too late to be what you might have been.",
        medium: "In three words I can sum up everything I've learned about life: it goes on. The greatest glory in living lies not in never falling, but in rising every time we fall. To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. The future belongs to those who believe in the beauty of their dreams.",
        hard: "The impediment to action advances action. What stands in the way becomes the way. Be yourself; everyone else is already taken. For every minute you are angry you lose sixty seconds of happiness. We are what we repeatedly do. Excellence, then, is not an act, but a habit. It is not the mountain we conquer, but ourselves."
    },
    pangram: {
        easy: "The quick brown fox jumps over the lazy dog.",
        medium: "Jaded zombies acted quaintly but kept driving their oxen forward.",
        hard: "Foxy parsons quiz and vex baffled jockeys before theXs hit Chicago."
    }
};


const shuffle = (array: string[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}


export const generatePracticeText = (settings: Settings): { text: string } => {
    const { difficulty, textSource, customText } = settings;

    if (textSource === 'custom') {
        return { text: customText.trim() || '' };
    }

    const wordCountMap = {
        easy: 20,
        medium: 35,
        hard: 50,
    };
    const wordCount = wordCountMap[difficulty];
    
    const sourceText = texts[textSource][difficulty];
    const words = sourceText.split(' ');
    
    if (textSource === 'random') {
        const shuffledWords = shuffle(words);
        return { text: shuffledWords.slice(0, wordCount).join(' ') };
    }

    if (textSource === 'quotes') {
        // For quotes, we'll return one full sentence/quote
         const sentences = sourceText.split('. ');
         const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
         return { text: randomSentence };
    }

    if (textSource === 'pangram') {
      return { text: sourceText };
    }

    return { text: "The quick brown fox jumps over the lazy dog." };
};
