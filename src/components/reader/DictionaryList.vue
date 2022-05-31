<template>
    <h5>Dictionaries</h5>
    <ol class="dictionaries" v-for="dictionary in dictionaries" :key="dictionary.id">
        <li @click="openDictionaryLink(dictionary)">{{dictionary.name}}</li>
    </ol>
</template>

<script>
    export default {
        name: "DictionaryList",
        components: {},
        props: {
            wordText: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                dictionaries: [],
            };
        },
        methods: {
            openDictionaryLink(dictionary) {
                const link_template = dictionary.link;
                const link = link_template.replace("<text>", this.wordText)
                const ref = window.open(link, "Dictionary", 'left=20,top=20,width=800,height=500,toolbar=1,resizable=0');
                ref.focus();
            }
        }
        ,
        async mounted() {
            this.dictionaries = await this.$store.dispatch("fetchDictionaries",
                {
                    language: this.$route.params.learningLanguage
                });
        }
    }
</script>

<style scoped>
    .dictionaries {
        display: flex;
        flex-direction: column;
        row-gap: 0.25rem;
    }

    .dictionaries > li {
        background-color: #FFE675;
        padding: 15px 10px;
        cursor: pointer;
        font-size: 1rem;
        color: black;
        border-radius: 5px;
        width: 100%;
    }
</style>