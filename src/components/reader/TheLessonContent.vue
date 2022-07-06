<template>
    <div @click="onBackgroundClicked">
        <lesson-paragraph class="title"
                          :paragraph-elements="lessonElements.title"
                          :words="words"
                          :phrases="phrases"
                          component="h2"
                          @onWordClicked="onWordClicked"
                          @onPhraseClicked="onPhraseClicked">
        </lesson-paragraph>

        <div class="lesson-text">
            <lesson-paragraph v-for="(paragraph, paragraphIndex) in lessonElements.text"
                              :paragraph-elements="paragraph"
                              :words="words"
                              :phrases="phrases"
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
        emits: ['onWordClicked', 'onPhraseClicked', 'onBackgroundClicked'],
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
            onPhraseClicked(phrase) {
                this.$emit('onPhraseClicked', phrase);
            },
            onBackgroundClicked() {
                this.$emit('onBackgroundClicked');
            },
        },
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