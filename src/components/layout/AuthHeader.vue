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
            <router-link :to="{ name: 'add-lesson' }">
                <button class="add-lesson-button link">
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                </button>
            </router-link>
            <router-link :to="{ name: 'sign-out' }">
                <button class="sign-out-button button-hollow link">Sign Out</button>
            </router-link>

        </div>


    </header>
</template>
<script>
    import store from "@/store";

    export default {
        name: "AuthHeader",
        components: {},
        data() {
            return {
                learningLanguage: null
            };
        },
        async mounted() {
            //if no lang was specified
            if (this.$route.name !== undefined) {
                const languages = await store.dispatch('fetchUserLanguages');
                this.learningLanguage = languages[0];
            }
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

    .add-lesson-button {
        background-color: var(--on-primary-color);
        border: none;
        height: 25px;
        width: 25px;
    }


</style>