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
            <div class="drop-down">
                <label for="dropdown-checkbox" class="link">
                    <span class="add-button">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                    </span>
                </label>

                <input type="checkbox" id="dropdown-checkbox" ref="dropdown-checkbox">
                <ul class="add-menu">
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
<!--                    <li>-->
<!--                        <router-link :to="{ name: '' }">-->
<!--                            Import Website-->
<!--                        </router-link>-->
<!--                    </li>-->
<!--                    <li>-->
<!--                        <router-link :to="{ name: '' }">-->
<!--                            Import E-book-->
<!--                        </router-link>-->
<!--                    </li>-->
                </ul>
            </div>

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
        watch: {
            $route() {
                this.$refs["dropdown-checkbox"].checked = false;
            }
        },
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


    .drop-down {
        margin: 0 auto;
        display: inline-block;
        padding: 0 30px;
        position: relative;
        text-align: center;
    }

    .add-menu {
        position: absolute;
        top: 50px;
        left: -20px;
        clear: both;
        opacity: 0;
        overflow: hidden;
        text-align: center;
        transition: opacity .4s ease;
        width: 150px;
        border: 1px solid gray;
        border-radius: 8px;
    }

    .add-menu li {
        background-color: white;
    }


    .add-menu li a {
        display: block;
        padding: 10px 5px;
        text-decoration: none;
        color: black;
    }

    .add-menu li:hover {
        background-color: lightgray;
        cursor: pointer;
    }

    #dropdown-checkbox {
        position: absolute;
        opacity: 0;
        height: 0;
    }

    #dropdown-checkbox:checked + .add-menu {
        opacity: 1;
    }
</style>