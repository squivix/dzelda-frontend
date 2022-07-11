<template>
    <div @click="onBackgroundClicked">
        <lesson-paragraph class="title"
                          :paragraph-elements="lessonElements.title"
                          :words="words"
                          :phrases="phrases"
                          :paragraph-index="0"
                          component="h2"
                          @onWordClicked="onWordClicked"
                          @onPhraseClicked="onPhraseClicked">
        </lesson-paragraph>

        <div class="lesson-text">
            <lesson-paragraph v-for="(paragraph, paragraphIndex) in lessonElements.text"
                              :paragraph-elements="paragraph"
                              :words="words"
                              :phrases="phrases"
                              :paragraph-index="paragraphIndex+1"
                              :key="paragraphIndex"
                              @onWordClicked="onWordClicked"
                              @onPhraseClicked="onPhraseClicked">
            </lesson-paragraph>
        </div>
    </div>
</template>

<script>
    import LessonParagraph from "@/components/reader/LessonParagraph";

    export default {
        name: "TheLessonContent",
        components: {LessonParagraph},
        emits: ['onWordClicked', 'onPhraseClicked', 'onNewPhraseSelected', 'onBackgroundClicked'],
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
            phrases: {
                type: Object,
                required: true
            },
            lessonElements: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                dragStartWord: null,
            };
        },
        methods: {
            onWordClicked(word) {
                this.$emit('onWordClicked', word);
            },
            onPhraseClicked(phraseText) {
                this.$emit('onPhraseClicked', phraseText);
            },
            onBackgroundClicked() {
                this.clearSelectedPhrases();
                this.$emit('onBackgroundClicked');
            },
            onNewPhraseSelected(phraseText) {
                this.$emit('onNewPhraseSelected', phraseText);
            },
            clearSelectedPhrases() {
                document.querySelectorAll(".phrase-selected").forEach((el) => el.classList.remove("phrase-selected"))
            },
            wrapperDrop() {
                const selectedPhrase = document.querySelectorAll(".phrase-selected");
                let phraseText = "";
                selectedPhrase.forEach((wrapperNode) => {
                    const wordNode = wrapperNode.childNodes[0];
                    if (wordNode.classList.contains("word"))
                        phraseText += wordNode.innerText.toLowerCase() + " ";
                });
                phraseText = phraseText.trim();
                console.log(phraseText);

                //new phrase
                if (!this.phrases[phraseText]) {
                    this.onNewPhraseSelected(phraseText);
                } else {
                    this.onPhraseClicked(phraseText);
                }
            }
        },
        mounted() {
            document.body.addEventListener("drop", this.wrapperDrop)
            document.body.addEventListener("dragover", e => e.preventDefault())
            document.body.addEventListener("dragenter", e => e.preventDefault())
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
        padding-top: 0.5rem;
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

</style>