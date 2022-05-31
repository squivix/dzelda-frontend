<template>
    <header>
        <div class="title-nav-div">
            <router-link :to="{ name: 'home' }" style="text-decoration: none; color: inherit">
                <h1 class="unselectable">FLA</h1>
            </router-link>
            <nav>
                <ul>
                    <router-link :to="{ name: 'explore' }" style="text-decoration: none; color: inherit">
                        <li>Explore</li>
                    </router-link>

                    <router-link :to="{ name: 'my-lessons' }" style="text-decoration: none; color: inherit">
                        <li>My Lessons</li>
                    </router-link>

                    <router-link :to="{ name: 'my-vocab' }" style="text-decoration: none; color: inherit">
                        <li>My Vocab</li>
                    </router-link>
                </ul>
            </nav>
        </div>


        <div id="auth-button">
            <router-link :to="{ name: 'sign-out' }">
                <button class="button-hollow link">Sign Out</button>
            </router-link>
        </div>


    </header>
</template>
<script>
    import store from "@/store";

    export default {
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

    #auth-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: min(2vw, 15px);
    }

    button a {
        color: inherit;
    }

    button {
        min-width: 105px;
    }

    .button-hollow {
        color: var(--on-primary-color);
        border-color: var(--on-secondary-color);
    }

    @media screen and (max-width: 400px) {
        #auth-buttons {
            display: none;
        }
    }
</style>