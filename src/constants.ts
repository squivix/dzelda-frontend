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

const NEW_VOCABS_PERCENTAGE_THRESH = {
    easy: 15,
    medium: 50,
    hard: 100,
};

const GUIDED_USERNAME = "language_learner";

export default Object.freeze({
    ALL_VOCAB_LEVELS,
    SAVED_VOCAB_LEVELS,
    NEW_VOCABS_PERCENTAGE_THRESH,
    GUIDED_USERNAME
});