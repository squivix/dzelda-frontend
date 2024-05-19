import {VocabLevel} from "dzelda-common";

export const ALL_VOCAB_LEVELS = Object.values(VocabLevel).filter(v => typeof v == "number") as VocabLevel[]


const NEW_VOCABS_PERCENTAGE_THRESH = {
    easy: 15,
    medium: 50,
    hard: 100,
};


export default Object.freeze({
    ALL_VOCAB_LEVELS,
    NEW_VOCABS_PERCENTAGE_THRESH,
});
export const NEW_PHRASE_HINT_LEARNERS_THRESHOLD = 3;
