<template>
    <base-card v-if="!loading">
        <template v-slot:all>
            <the-lesson-content
                    :title="lesson.title"
                    :text="lesson.text"
                    :lessonElements="lessonElements"
                    :words="words"
                    :phrases="phrases"
                    class="lesson-content"
                    @onWordClicked="setSelectedVocab"
                    @onPhraseClicked="setSelectedVocab"
                    @onNewPhraseSelected="selectNewPhrase"
                    @onBackgroundClicked="clearSelectedVocab">
            </the-lesson-content>
            <the-meaning-panel
                    class="meaning-panel"
                    :vocab="selectedVocab"
                    @onMeaningAdded="onMeaningAdded"
                    @onVocabLevelSet="onVocabLevelSet"
                    @onMeaningDeleted="onMeaningDeleted">
            </the-meaning-panel>
        </template>
    </base-card>
</template>
<script>
    import TheLessonContent from '../components/reader/TheLessonContent.vue';
    import TheMeaningPanel from '../components/reader/TheMeaningPanel.vue';
    import {VOCAB_LEVELS} from "@/constants";
    import {escapeRegExp} from "@/utils";

    export default {
        name: "LessonReader.vue",
        components: {TheLessonContent, TheMeaningPanel},
        data() {
            return {
                loadingLesson: true,
                loadingWords: true,
                parsingLesson: true,
                lesson: null,
                words: {},
                phrases: {},
                selectedVocab: null,
                lessonElements: null,
            };
        },
        async created() {
            await this.fetchLesson();
            await this.fetchWordsLevels();
            this.parseLesson();
        },
        computed: {
            loading() {
                return this.loadingLesson || this.loadingWords || this.parsingLesson;
            },
            vocab() {
                return {...this.words, ...this.phrases};
            }
        },
        methods: {
            async fetchLesson() {
                this.loadingLesson = true;
                this.lesson = await this.$store.dispatch("fetchLesson", {
                    lessonId: this.$route.params.lessonId,
                    languageCode: this.$route.params.learningLanguage
                });
                this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, '\n\n');
                this.loadingLesson = false;
            },
            async fetchWordsLevels() {
                this.loadingWords = true;
                this.words = await this.$store.dispatch("fetchLessonWords", {lessonId: this.$route.params.lessonId});
                this.phrases = await this.$store.dispatch("fetchLessonPhrases", {lessonId: this.$route.params.lessonId});
                this.loadingWords = false;
            },
            setSelectedVocab(vocabText) {
                this.selectedVocab = {text: vocabText, ...this.vocab[vocabText.toLowerCase()]};
            },
            selectNewPhrase(phraseText) {
                this.selectedVocab = {text: phraseText, level: VOCAB_LEVELS.NEW, all_meanings: [], user_meanings: []};
            },
            clearSelectedVocab() {
                this.selectedVocab = null;
            },
            onMeaningAdded(vocab, new_meaning) {
                const key = vocab.text.toLowerCase();

                if (this.vocab[key] === undefined) {
                    //only for new phrases
                    this.phrases[key] = vocab;
                    //TODO: find less expensive solution to update lessonElements where the new phrase was added
                    this.parseLesson();
                }

                this.onVocabLevelSet(vocab, vocab.level);
                this.vocab[key].user_meanings.push(new_meaning);
                this.vocab[key].id = vocab.id;
                this.setSelectedVocab(vocab.text);
            },
            onVocabLevelSet(vocab, level) {
                const key = vocab.text.toLowerCase();
                this.vocab[key].level = level;
                if (level === VOCAB_LEVELS.IGNORED || level === VOCAB_LEVELS.KNOWN) {
                    this.vocab[key].user_meanings = [];
                    this.clearSelectedVocab();
                } else
                    this.setSelectedVocab(vocab.text);
            },
            onMeaningDeleted(word, deleted_meaning) {
                const index = word.user_meanings.findIndex((meaning) => meaning.id === deleted_meaning.id)
                word.user_meanings.splice(index, 1);
                if (word.user_meanings.length === 0)
                    this.onVocabLevelSet(word, VOCAB_LEVELS.NEW);
            },
            parseLesson() {
                this.parsingLesson = true;
                this.lessonElements = {
                    title: this.parseStringToElements([this.lesson.title])[0],
                    text: this.parseStringToElements(this.lessonParagraphs(this.lesson.text))
                };
                this.parsingLesson = false;
            },
            parseStringToElements(texts) {
                let paragraphList = [];

                const phrases = Object.keys(this.phrases);
                for (let paragraph of texts) {
                    let elements = this.getTextElements(paragraph);
                    let paragraphElements = [];
                    for (let element of elements)
                        paragraphElements.push({text: element, isWord: this.isWord(element), phrases: {}});

                    for (let phrase of phrases) {
                        let regex = new RegExp(`${escapeRegExp(phrase)}`, 'ig');
                        let matches = paragraph.matchAll(regex);

                        for (let match of matches) {
                            let beforePhraseIndex = this.getTextElements(paragraph.substring(0, match.index)).length;
                            let phraseSlice = this.getTextElements(match[0]);
                            const phraseElements = paragraphElements.slice(beforePhraseIndex, beforePhraseIndex + phraseSlice.length)
                            phraseElements.forEach((pe, index) => pe.phrases[phrase] = index);
                        }
                    }
                    paragraphList.push(paragraphElements);
                }
                return paragraphList;
            },
            getTextElements(paragraph, regex) {
                //[^\p{L}\d]
                return paragraph.split(regex ?? /([^\p{L}\d])/gu).filter((word) => word !== '');
                // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
            },
            lessonParagraphs(text) {
                return text.split(/\s\s+/g);
            },
            isWord(text) {
                //TODO fix string with numbers being counted as word ex: '123abc' returns true
                return !!text.match(/[\p{L}]+/gu);
            },
        }
        ,
    }
    ;
</script>
<style>
    body {
        user-select: none;
    }
</style>
<style scoped>
    .base-card {
        width: 80vw;
        display: grid;
        grid-template-columns: 2fr 1.3fr;
        grid-template-rows: 75vh;
        margin: auto;
        column-gap: 2rem;
        border-radius: 20px;
        max-width: 1300px;
        padding: 40px min(5vw, 20px);
    }

    .lesson-content {
    }

    .meaning-panel {
    }
</style>