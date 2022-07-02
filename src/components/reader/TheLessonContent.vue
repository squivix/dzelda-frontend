<template>
    <div @click="onBackgroundClicked">
        <h2 class="title">
      <span v-for="(word, index) in paragraphWords(title)"
            :key="index"
            :class="isWord(word)?getWordClass(word):null"
            :id="isWord(word)?`title-word-${index}`:null"
            @click.stop="isWord(word)?onWordClicked(word):null"
            :draggable="isWord(word)?true:null"
            @dragstart="isWord(word)?wordDragStart($event):null"
            @dragenter="isWord(word)?wordDragEnter($event):null">
          {{ word }}</span>
        </h2>

        <div class="lesson-text">
            <p v-for="(paragraph, paragraphIndex) in lessonParagraphs" :key="paragraphIndex">
                <span v-for="(word, wordIndex) in paragraphWords(paragraph)"
                      :key="wordIndex"
                      :class="isWord(word)?getWordClass(word):null"
                      :id="isWord(word)?`paragraph-${paragraphIndex}-word-${wordIndex}`:null"
                      @click.stop="isWord(word)?onWordClicked(word):null"
                      :draggable="isWord(word)?true:null"
                      @dragstart="isWord(word)?wordDragStart($event):null"
                      @dragenter="isWord(word)?wordDragEnter($event):null">
                  {{ word }}</span>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TheLessonContent",
        components: {},
        props: {
            title: {
                type: String,
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            words: {
                type: Object,
                required: true,
            },
        },
        emits: ['onWordClicked', 'onBackgroundClicked'],
        data() {
            return {
                draggStartWord: null,
            };
        },
        computed: {
            lessonParagraphs() {
                return this.text.split(/\s\s+/g);
            },
        },
        methods: {
            paragraphWords(paragraph) {
                //[^\p{L}\d]
                return paragraph.split(/([^\p{L}\d])/gu);
                // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
            },
            getWordClass(word) {
                switch (this.words[word.toLowerCase()].level) {
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
            onWordClicked(word) {
                if (this.isWord(word))
                    this.$emit('onWordClicked', word);
            },
            wordDragStart(event) {
                // console.log(`start: ${event.target.innerText}`);
                this.draggStartWord = event.target;
            },
            wordDragEnter(event) {
                console.log(this.draggStartWord.id)
                let endWord = event.target
                let startWord = this.draggStartWord;
                if (!endWord.classList.contains('word') || !startWord.classList.contains('word'))
                    return;

                let selectedWords;
                if (endWord === startWord) {
                    selectedWords = [startWord];
                } else {
                    let tokens = startWord.id.split('-');
                    const startWordNum = Number(tokens[tokens.length - 1]);
                    tokens = endWord.id.split('-');
                    const endWordNum = Number(tokens[tokens.length - 1]);

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
                    document.querySelectorAll('.word').forEach((w)=>w.classList.remove('phrase-word'))
                    selectedWords.forEach((w) => w.classList.add("phrase-word"));
                }
            },
            onBackgroundClicked() {
                this.$emit('onBackgroundClicked');
            },
            isWord(text) {
                //TODO fix string with numbers being counted as word ex: '123abc' returns true
                return !!text.match(/[\p{L}]+/gu);
            },
        }
        ,
        mounted() {

        }
    }
    ;
</script>

<style scoped>
    .lesson-content {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        user-select: none;
    }

    .title {
        font-size: 1.55rem;
        line-height: 2.5rem;
    }

    .lesson-text {
        overflow-y: auto;
    }

    p {
        font-size: 1.15rem;
        line-height: 2.25rem;
    }

    span {
        /*user-select: none;*/
    }

    span::selection {
        /*background: transparent;*/
        color: red;
        background: yellow;
    }

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

    .word-level-1 {
        background-color: #ffeda1;
    }

    .word-level-2 {
        background-color: #fff2ab;
    }

    .word-level-3 {
        background-color: #fff6c7;
    }

    .word-level-4 {
        background-color: transparent;
        border-bottom: 1px dotted black;
    }

    .word-known,
    .word-learned,
    .word-ignored {
        background-color: transparent;
    }

    .phrase-word {
        background-color: red;
    }
</style>