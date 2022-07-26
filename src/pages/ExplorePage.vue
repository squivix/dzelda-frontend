<template>
    <h1>Explore</h1>
<!--    <base-card title="Explore" class="explore-base-card">-->
<!--        <template v-slot:content>-->
            <nav class="tab-bar">
                <ul class="tab-labels">
                    <li :class="{'tab-label':true, 'current-tab':currentTab==='Browse'}"
                        @click="setCurrentTab('Browse')">
                        Browse
                    </li>
                    <li :class="{'tab-label':true, 'current-tab':currentTab==='Guided'}"
                        @click="setCurrentTab('Guided')">
                        Guided
                    </li>
                    <li :class="{'tab-label':true, 'current-tab':currentTab==='Search' }"
                        @click="setCurrentTab('Search')">
                        Search
                    </li>
                    <li class="filler"></li>
                </ul>
            </nav>

            <div class="tab-content">
                The tab content is supposed to be here
            </div>
<!--        </template>-->
<!--    </base-card>-->
</template>

<script>
    import BaseCard from "@/components/ui/BaseCard";

    export default {
        name: "ExplorePage",
        components: {BaseCard},
        data() {
            return {
                currentTab: "Browse"
            };
        },
        methods: {
            setCurrentTab(tab) {
                this.currentTab = tab;
            }
        }
    };
</script>

<style scoped>
    .explore-base-card {

    }

    .tab-labels {
        display: flex;
        flex-direction: row;
    }

    .tab-labels .tab-label {
        background-color: #F0F0F0;
        font-size: 1.2rem;
        padding: 1rem 1rem;
        border: 1px solid darkgray;
    }

    .tab-labels .tab-label:hover {
        cursor: pointer;
    }

    .tab-labels .tab-label.current-tab {
        background-color: white;
        border-bottom-color: white;
    }

    .filler {
        flex-grow: 1;
        border-bottom: 1px solid darkgray;
    }

    .tab-content {
        border: 1px solid darkgray;
        border-top: none;
        border-radius: 3px;
        height: 100vh;
    }
</style>