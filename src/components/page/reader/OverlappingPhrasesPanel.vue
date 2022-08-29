<template>
    <div class="overlapping-phrase-panel">
        <h4>Overlapping phrases</h4>
        <ul>
            <li v-for="(phrase, index) in phrases"
                :key="index"
                @click="onPhraseClick(phrase)">
                {{phrase}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "OverlappingPhrasesPanel",
        emits: ["onPhraseClick"],
        props: {
            phrases: {
                type: Array,
                required: true
            }
        },
        methods: {
            onPhraseClick(phraseText) {
                this.$emit("onPhraseClick", phraseText);
            }
        }
    }
</script>

<style scoped>
    .overlapping-phrase-panel {
        background-color: #f0f9fe;
        height: 100%;
        padding: 1vw;
        border-radius: 10px;
    }

    h4 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    li {
        margin-bottom: 0.75rem;
        font-size: 1rem;

    }

    li:hover {
        cursor: pointer;
    }

</style>