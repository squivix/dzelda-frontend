<template>
    <component :is="component">
        <span v-for="(element, index) in paragraphElements"
              :key="index"
              :class="getWrapperClass(element)"
              @click.stop="onWrapperClicked($event,index,element)"
              :ref="`word-wrapper-${index}`">
        <span :class="getWordClass(element)"
              :id="`w${index}`"
              v-if="element.isWord"
              @click.stop="onWordClicked(element.text)">
        <!--          :draggable="true"-->
            <!--          @dragstart="wordDragStart"-->
            <!--          @dragenter="wordDragEnter">-->
      {{ element.text }}</span>
    <span v-else>
        {{ element.text }}
    </span>
    </span>
    </component>
</template>

<script>
    import {isEmptyObject} from "@/utils";

    export default {
        name: "LessonParagraph",
        computed: {},
        emits: ['onWordClicked', 'onPhraseClicked'],
        props: {
            paragraphElements: {
                type: Array,
                required: true
            },
            words: {
                type: Object,
                required: true
            },
            phrases: {
                type: Object,
                required: true
            },
            component: {
                type: String,
                required: false,
                default: "p"
            },
        },
        data() {
            return {};
        },
        methods: {
            onWordClicked(word) {
                this.$emit('onWordClicked', word);
            },
            onWrapperClicked(event, index, element) {
                //if word part of multiple phrases
                let wordPhrases = Object.keys(element.phrases);
                if (wordPhrases.length > 1) {

                } else {
                    const wrapperDomElem = this.$refs[`word-wrapper-${index}`][0];
                    if (wrapperDomElem.classList.contains("phrase-new"))
                        return;
                    let phraseText = wordPhrases[0];

                    this.$emit('onPhraseClicked', phraseText);
                }
            },
            getWordClass(element) {
                let word = this.words[element.text.toLowerCase()];
                if (!element.isWord)
                    return "";
                switch (word.level) {
                    case -1:
                        return 'word word-ignored';
                    case 0:
                        return 'word word-new';
                    case 1:
                        return 'word word-level-1';
                    case 2:
                        return 'word word-level-2';
                    case 3:
                        return 'word word-level-3';
                    case 4:
                        return 'word word-level-4';
                    case 5:
                        return 'word word-learned';
                    case 6:
                        return 'word word-known';
                    default:
                        return 'word';
                }
            },
            getWrapperClass(element) {
                return `${this.getPhrasePositionClass(element)} ${this.getPhraseLevelClass(element, Object.keys(element.phrases)[0])}`;
            },
            getPhraseLevelClass(element, phrase) {
                if (isEmptyObject(element.phrases))
                    return "";
                switch (this.phrases[phrase].level) {
                    case 0:
                        return 'phrase-new';
                    case 1:
                        return 'phrase-level-1 ';
                    case 2:
                        return 'phrase-level-2 ';
                    case 3:
                        return 'phrase-level-3';
                    case 4:
                        return 'phrase-level-4';
                    case 5:
                        return 'phrase-learned';
                    case 6:
                        return 'phrase-known';
                    default:
                        return '';
                }
            },
            getPhrasePositionClass(element) {
                if (isEmptyObject(element.phrases))
                    return "";
                let allStartWord = true, allEndWord = true;
                for (let phrase of Object.keys(element.phrases)) {
                    const indexInPhrase = element.phrases[phrase];
                    if (indexInPhrase !== 0)
                        allStartWord = false;
                    if (indexInPhrase !== phrase.split(" ").length)
                        allEndWord = false;
                }
                if (allStartWord)
                    return "word-wrapper phrase-start";
                else if (allEndWord)
                    return "word-wrapper phrase-end";
                else
                    return "word-wrapper phrase-middle";
            },
            wordDragStart(event) {
                // console.log(`start: ${event.target.innerText}`);
                this.dragStartWord = event.target;
                event.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
            },
            wordDragEnter(event) {
                let endWord = event.target;
                let startWord = this.dragStartWord;
                if (!endWord.classList.contains('word') || !startWord.classList.contains('word'))
                    return;

                let selectedWords;
                if (endWord === startWord) {
                    selectedWords = [startWord];
                } else {
                    let tokens = startWord.id.split('-');
                    const startWordNum = Number(tokens[tokens.length - 1]);
                    const startWordParagraph = Number(tokens[1]);
                    tokens = endWord.id.split('-');
                    const endWordNum = Number(tokens[tokens.length - 1]);
                    const endWordParagraph = Number(tokens[1]);
                    if (startWordParagraph !== endWordParagraph)
                        return;

                    if (startWordNum > endWordNum)
                        [startWord, endWord] = [endWord, startWord];

                    selectedWords = [startWord];
                    const wordsAfterStart = document.querySelectorAll(`#${startWord.id} ~ .word`)
                    // console.log(wordsAfterStart)
                    for (const w of wordsAfterStart) {
                        if (w === endWord)
                            break;
                        selectedWords.push(w);
                    }
                    selectedWords.push(endWord);
                    document.querySelectorAll('.word').forEach((w) => w.classList.remove('phrase-word'))
                    selectedWords.forEach((w) => {
                        w.classList.add("phrase-word")
                    });
                }
            },
        }
    }
</script>

<style scoped>

    .word {
        border: 1px solid transparent;
        padding: 0.1rem 0.2rem;
        border-radius: 5px;
    }

    .word:hover {
        border: 1px solid darkblue;
        cursor: pointer;
    }

    .word-new {
        background-color: #aee0f4;
    }

    .phrase-new {

    }

    .phrase-new:hover {
        /*background-color: ghostwhite;*/
        cursor: default !important;
    }

    .word-level-1,
    .phrase-level-1 {
        background-color: #ffeda1;
    }

    .word-level-2,
    .phrase-level-2 {
        background-color: #fff2ab;
    }

    .word-level-3,
    .phrase-level-3 {
        background-color: #fff6c7;
    }

    .word-level-4,
    .phrase-level-4 {
        background-color: transparent;
        border-bottom: 1px dotted black;
    }

    .word-known,
    .word-learned,
    .word-ignored,
    .phrase-known,
    .phrase-learned {
        background-color: transparent;
    }

    .word-wrapper {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border: 1px solid transparent;
    }

    .word-wrapper:hover {
        cursor: pointer;
    }

    .phrase-start {
        padding-left: 0.25rem;
        border-start-start-radius: 5px;
        border-end-start-radius: 5px;
    }

    .phrase-end {
        padding-right: 0.25rem;
        border-end-end-radius: 5px;
        border-start-end-radius: 5px;
    }

    .phrase-middle {
        border: 1px solid transparent;
    }
</style>