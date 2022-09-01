<template>
    <div class="vocab-table-wrapper">
        <table class="vocab-table">
            <thead>
            <tr>
                <th>Vocab</th>
                <th>Meanings</th>
                <th>Level</th>
            </tr>
            </thead>
            <tbody class="vocab-tbody">
            <vocab-table-row v-for="vocab in vocabs" :key="vocab.id"
                             :vocab="vocab"
                             @onVocabClicked="onVocabClicked"
                             @onVocabLevelSet="onVocabLevelSet">

            </vocab-table-row>
            </tbody>
        </table>
    </div>
</template>

<script>
    import VocabTableRow from "@/components/page/my-vocabs/VocabTableRow.vue";

    export default {
        name: "VocabTable",
        components: {VocabTableRow},
        props: {
            vocabs: {
                type: Array,
                required: true,
            },
        },
        methods: {
            onVocabClicked(vocab) {
                this.$emit("onVocabClicked", vocab)
            },
            onVocabLevelSet(vocab, level) {
                this.$emit("onVocabLevelSet", vocab, level)
            }
        }
    }
</script>

<style scoped>

    .vocab-table-wrapper {
        overflow-y: auto;
        max-height: 100vh;
    }

    table {
        border-collapse: collapse;
        width: 100%;
    }

    th {
        background-color: white;
        padding-bottom: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        text-align: start;
        position: sticky;
        top: 0;
    }

    th:not(.centered-table-col) {
        text-align: start;
        vertical-align: middle;
        font-weight: bold;
    }

</style>