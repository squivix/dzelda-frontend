<template>
    <base-card title="New Language">
        <template v-slot:content>
            <div class="content">
                <p>Select a new language to learn from our list of supported languages</p>
                <ul v-if="supportedLanguages" class="languages">
                    <li v-for="language in supportedLanguages" :key="language.code" @click="addNewLanguage(language)">
                        <font-awesome-icon v-if="language.isLearning" icon="check"
                                           class="is-learning-check"></font-awesome-icon>
                        <img :src="language.flag_image_circular" :alt="`${language.code} language flag`"
                             class="language-flag">
                        <div class="title-learners">
                            <h4>{{language.name}}</h4>
                            <p>{{language.learners}} learners</p>
                        </div>
                    </li>
                </ul>
            </div>
        </template>
    </base-card>
</template>

<script>
    import BaseCard from "@/components/general/ui/BaseCard";
    import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

    export default {
        name: "NewLanguagePage",
        components: {BaseCard, FontAwesomeIcon},
        data() {
            return {
                supportedLanguages: null
            };
        },
        methods: {
            async fetchSupportedLanguages() {
                return await this.$store.dispatch("content/fetchAllLanguages");
            },
            async addNewLanguage(language) {
                //TODO move to custom dialog
                if (language.isLearning)
                    alert(`You are already learning ${language.name}`);
                else if (confirm(`Start learning ${language.name}?`)) {
                    await this.$store.dispatch("content/addLanguage", {language: language.code});
                    await this.$router.push({name: 'explore', params: {learningLanguage: language.code}})
                }
            }
        },
        async mounted() {
            const supportedLanguages = (await this.fetchSupportedLanguages());
            this.supportedLanguages = supportedLanguages.map((lang) => {
                return {
                    ...lang,
                    isLearning: this.$store.getters["content/userLanguages"].findIndex(l => l.code === lang.code) !== -1
                }
            });
        }

    }
</script>

<style scoped>
    .content {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }

    .languages {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        row-gap: 1rem;
        column-gap: 1rem;
        flex-grow: 1;
    }

    .languages li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 1rem;
        padding: 1rem;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border: 1px solid lightgray;
        border-radius: 10px;
        transition: transform 0.15s ease-out;
        overflow: hidden;
        box-sizing: border-box;
    }

    .languages li:hover {
        transform: scale(1.04);
        cursor: pointer;
    }

    .languages li .title-learners {
        line-height: 1.25rem;
        text-align: center;
    }

    .languages li h4 {
        font-size: 1.2rem;
    }

    .languages li p {
        font-size: 0.9rem;
        color: darkslategray;
    }

    .language-flag {
        width: 125px;
        height: 125px;
    }

    .learning-language {
        background-color: red;
    }

    .is-learning-check {
        background-color: var(--secondary-color);
        color: var(--on-secondary-color);
        width: 20px;
        height: 20px;
        padding: 0.2rem;
        border-radius: 3px;
        align-self: flex-end;
    }

</style>