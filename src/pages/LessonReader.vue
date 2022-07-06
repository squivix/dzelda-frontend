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
                    @onWordClicked="setSelectedWord"
                    @onPhraseClicked="setSelectedPhrase"
                    @onBackgroundClicked="clearSelectedWord">
            </the-lesson-content>
            <the-meaning-panel
                    class="meaning-panel"
                    :word="selectedWord"
                    @onMeaningAdded="onMeaningAdded"
                    @onWordLevelSet="onWordLevelSet"
                    @onMeaningDeleted="onMeaningDeleted">
            </the-meaning-panel>
        </template>
    </base-card>
</template>
<script>
    import TheLessonContent from '../components/reader/TheLessonContent.vue';
    import TheMeaningPanel from '../components/reader/TheMeaningPanel.vue';
    import {WORD_LEVELS} from "@/constants";

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
                selectedWord: null,
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
                return {...this.words, ...this.phrases}
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

            setSelectedWord(word) {
                this.selectedWord = {text: word, ...this.vocab[word.toLowerCase()]};
            },
            setSelectedPhrase(phrase) {
                this.selectedWord = {text: phrase, ...this.phrases[phrase.toLowerCase()]};
            },
            clearSelectedWord() {
                this.selectedWord = null;
            },


            onMeaningAdded(word, new_meaning) {
                const key = word.text.toLowerCase();
                this.onWordLevelSet(word, word.level);
                this.vocab[key].user_meanings.push(new_meaning);
                this.vocab[key].id = word.id;
                this.setSelectedWord(word.text);
            },
            onWordLevelSet(word, level) {
                this.vocab[word.text.toLowerCase()].level = level;
                if (level === WORD_LEVELS.IGNORED || level === WORD_LEVELS.KNOWN) {
                    this.vocab[word.text.toLowerCase()].user_meanings = [];
                    this.clearSelectedWord();
                } else
                    this.setSelectedWord(word.text);
            },
            onMeaningDeleted(word, deleted_meaning) {
                const index = word.user_meanings.findIndex((meaning) => meaning.id === deleted_meaning.id)
                word.user_meanings.splice(index, 1);
                if (word.user_meanings.length === 0)
                    this.onWordLevelSet(word, WORD_LEVELS.NEW);
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
                    let words = this.paragraphWords(paragraph);
                    let paragraphElements = [];
                    for (let word of words) {
                        if (this.isWord(word))
                            paragraphElements.push({text: word, isWord: true, phrases: {}});
                        else
                            paragraphElements.push({text: word, isWord: false, phrases: {}});
                    }
                    for (let phrase of phrases) {
                        let regex = new RegExp(`${this.escapeRegExp(phrase)}`, 'ig');
                        let matches = paragraph.matchAll(regex);

                        for (let match of matches) {
                            let beforePhraseIndex = this.paragraphWords(paragraph.substring(0, match.index)).length;
                            let phraseSlice = this.paragraphWords(match[0]);
                            const phraseElements = paragraphElements.slice(beforePhraseIndex, beforePhraseIndex + phraseSlice.length)
                            phraseElements.forEach((pe, index) => pe.phrases[phrase] = index);
                            // console.log(phraseElements)
                        }
                    }
                    paragraphList.push(paragraphElements);
                }
                return paragraphList;
            },
            paragraphWords(paragraph, regex) {
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
            escapeRegExp(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
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