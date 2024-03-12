export const ALL_VOCAB_LEVELS = {
    IGNORED: -1,
    NEW: 0,
    LEVEL_1: 1,
    LEVEL_2: 2,
    LEVEL_3: 3,
    LEVEL_4: 4,
    LEARNED: 5,
    KNOWN: 6,
};

const SAVED_VOCAB_LEVELS = {
    LEVEL_1: 1,
    LEVEL_2: 2,
    LEVEL_3: 3,
    LEVEL_4: 4,
    LEARNED: 5,
};

export const LANGUAGE_LEVELS = {
    BEGINNER_1: "beginner1",
    BEGINNER_2: "beginner2",
    INTERMEDIATE_1: "intermediate1",
    INTERMEDIATE_2: "intermediate2",
    ADVANCED_1: "advanced1",
    ADVANCED_2: "advanced2",
};

const NEW_VOCABS_PERCENTAGE_THRESH = {
    easy: 15,
    medium: 50,
    hard: 100,
};


export default Object.freeze({
    ALL_VOCAB_LEVELS,
    SAVED_VOCAB_LEVELS,
    LANGUAGE_LEVELS,
    NEW_VOCABS_PERCENTAGE_THRESH,
});
export const NEW_PHRASE_HINT_LEARNERS_THRESHOLD = 3;
