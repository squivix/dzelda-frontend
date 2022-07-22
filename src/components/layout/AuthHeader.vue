<template>
    <header>
        <div class="title-nav-div">
            <router-link :to="{ name: 'home'}" style="text-decoration: none; color: inherit">
                <h1 class="unselectable">FLA</h1>
            </router-link>
            <nav>
                <ul>
                    <router-link :to="{ name: 'explore' }" style="text-decoration: none; color: inherit">
                        <li>Explore</li>
                    </router-link>

                    <router-link :to="{ name: 'my-library' }" style="text-decoration: none; color: inherit">
                        <li>My Library</li>
                    </router-link>

                    <router-link :to="{ name: 'my-vocab' }" style="text-decoration: none; color: inherit">
                        <li>My Vocab</li>
                    </router-link>
                </ul>
            </nav>
        </div>

        <div class="right-side-div">
            <base-drop-down v-if="currentLanguage" class="language-dropdown" label="language">
                <template v-slot:button>
                    <!--suppress HtmlUnknownTarget, JSUnresolvedVariable -->
                    <img :src="currentLanguage.flag_image_circular" alt="Current Language Icon"
                         class="language-icon current-language-icon">
                    <span class="language-button">
                        <font-awesome-icon icon="chevron-down"></font-awesome-icon>
                    </span>
                </template>
                <template v-slot:menu>
                    <ul class="dropdown-menu language-menu">
                        <li v-for="language in otherLanguages" :key="language.code">
                            <!--suppress HtmlUnknownTarget -->
                            <router-link :to="{ name: 'explore-lang' ,params:{learningLanguage:language.code}}">
                                <img :src="language.flag_image_circular" alt="Language Icon" class="language-icon">
                                {{language.name}}
                            </router-link>
                        </li>
                    </ul>
                </template>
            </base-drop-down>

            <base-drop-down :is-pointy="true" label="add-menu">
                <template v-slot:button>
                    <span class="add-button">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                    </span>
                </template>
                <template v-slot:menu>
                    <ul class="dropdown-menu add-menu">
                        <li>
                            <router-link :to="{ name: 'add-lesson' }">
                                Add Lesson
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'add-course' }">
                                Add Course
                            </router-link>
                        </li>
                    </ul>
                </template>
            </base-drop-down>

            <router-link :to="{ name: 'sign-out' }">
                <button class="sign-out-button button-hollow link">Sign Out</button>
            </router-link>
        </div>
    </header>
</template>
<script>
    import BaseDropDown from "@/components/ui/BaseDropDown";

    export default {
        name: "AuthHeader",
        components: {BaseDropDown},
        data() {
            return {};
        },
        computed: {
            currentLanguage() {
                return this.$store.getters.currentLanguage;
            }, userLanguages() {
                return this.$store.getters.userLanguages;
            },
            otherLanguages() {
                return this.userLanguages.filter(lang => lang.code !== this.currentLanguage.code)
            }
        },
        async mounted() {
        }
    }
</script>
<style scoped>
    header {
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px 2vw;
        background-color: var(--primary-color);
        z-index: 5;
    }

    header h1 {
        color: var(--on-primary-color);
    }

    header h1:hover {
        text-decoration: none;
    }

    h1 {
        font: var(--app-title-font);
    }

    .title-nav-div {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        column-gap: 3rem;
    }

    nav > ul {
        display: flex;
        flex-direction: row;
        column-gap: 2rem;
        font: 900 1.25rem sans-serif;
        color: var(--on-primary-color);
    }

    nav > ul > li {

    }

    nav > ul > li:hover {
        color: var(--primary-color-light);
        cursor: pointer;
    }

    .right-side-div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: min(2vw, 15px);
    }

    @media screen and (max-width: 400px) {
        .right-side-div {
            display: none;
        }
    }

    .sign-out-button {
        min-width: 105px;
        color: var(--on-primary-color);
        border-color: var(--on-secondary-color);
    }

    .add-button {
        background-color: var(--secondary-color);
        height: 30px;
        width: 30px;
        padding: 5px;
        border: 1px solid var(--on-secondary-color);
        border-radius: 8px;
    }

    .add-button svg {
        color: var(--on-secondary-color);
        font-size: 1rem;
    }

    .dropdown-menu {
        width: 11vw;
    }

    .dropdown-menu li {
        padding: 0;
    }

    .dropdown-menu li a {
        margin: 0;
        display: block;
        width: 100%;
        height: 100%;
        padding: 0.5rem 1rem;
        color: black;
        font-family: sans-serif;
        font-size: 1rem;
    }

    .dropdown-menu li:hover {
        cursor: pointer;
        background-color: lightgray;
    }

    .dropdown-menu a:hover {
        text-decoration: none;
    }

    .language-icon {
        width: 50px;
        height: 50px;
    }

    .current-language-icon {
        background-color: var(--on-primary-color);
        border-radius: 50%;
        padding: 0.2rem;
    }

    .language-button {
        background-color: var(--on-primary-color);
        padding: 0.2rem;
        border-start-end-radius: 5px;
        border-end-end-radius: 5px;
        margin-inline-start: -3px;
    }

    :deep(.dropdown-label) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
</style>