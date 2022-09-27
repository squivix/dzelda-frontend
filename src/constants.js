export const BASE_URL = "http://localhost:8000";
export const DEFAULT_COURSE_IMAGE_URL = `${BASE_URL}/static/course_blank.svg`;
export const DEFAULT_LESSON_IMAGE_URL = `${BASE_URL}/static/lesson_blank.svg`;
const ALL_VOCAB_LEVELS = {
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
    BASE_URL,
    ALL_VOCAB_LEVELS,
    SAVED_VOCAB_LEVELS,
    DEFAULT_COURSE_IMAGE_URL,
    DEFAULT_LESSON_IMAGE_URL,
    NEW_VOCABS_PERCENTAGE_THRESH,
    GUIDED_USERNAME
});