<template>
    <div>
        <template v-if="level>=vocabLevels.LEVEL_1&&level<=vocabLevels.LEVEL_4">
            {{level}}
        </template>
        <font-awesome-icon v-else-if="level===vocabLevels.LEARNED" icon="check">

        </font-awesome-icon>
    </div>
</template>

<script>
    import {VOCAB_LEVELS} from "@/constants";

    export default {
        name: "VocabLevelDisplay",
        props: {
            level: {
                type: Number,
                required: true
            }
        },
        computed: {
            vocabLevels() {
                return VOCAB_LEVELS;
            }
        }
    }
</script>

<style scoped>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        text-align: center;

        border: 1px solid gray;
        border-radius: 100%;
    }
</style>