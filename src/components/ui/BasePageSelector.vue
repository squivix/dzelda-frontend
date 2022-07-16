<template>
    <ol>
        <li>
            <button class="page-button" :disabled="currentPage<=1" @click="onPageClicked(currentPage-1)">
                <font-awesome-icon icon="angle-left"></font-awesome-icon>
            </button>
        </li>

        <li v-for="page in pages" :key="page">
            <button v-if="!Number.isNaN(Number(page))"
                    :class="{'page-button':true, 'current-page-button':page===currentPage}"
                    @click="onPageClicked(page)">
                {{page}}
            </button>
            <template v-else>
                {{page}}
            </template>
        </li>

        <li>
            <button class="page-button" :disabled="currentPage>=pageCount" @click="onPageClicked(currentPage+1)">
                <font-awesome-icon icon="angle-right"></font-awesome-icon>
            </button>
        </li>
    </ol>
</template>

<script>
    export default {
        name: "BasePageSelector",
        emits: ['onPageClicked'],
        props: {
            pageCount: {
                type: Number,
                required: true,
            },
            shownCount: {
                type: Number,
                required: false,
                default: 5,
            },
            currentPage: {
                type: Number,
                required: true
            },
            beforeCurrentCount: {
                type: Number,
                required: false,
                default: 3,
            }
        },
        data() {
            return {
                pages: null
            }
        },
        watch: {
            pageCount() {
                this.updatePages(this.currentPage);
            }
        },
        methods: {
            onPageClicked(page) {
                this.$emit("onPageClicked", page);
                this.updatePages(page);
            },
            updatePages(currentPage) {
                let pages = [];
                let start = Math.max(1, currentPage - this.beforeCurrentCount);
                let end = Math.min(this.pageCount + 1, start + this.shownCount + this.beforeCurrentCount);
                for (let i = start; i < end; i++)
                    pages.push(i);
                this.pages = pages;
            }
        },
        mounted() {
            this.updatePages(this.currentPage);
        }

    }
</script>

<style scoped>
    ol {
        display: flex;
        flex-direction: row;
        column-gap: 1rem;
    }

    li {
        text-align: center;
        vertical-align: middle;
    }

    .page-button {
        background-color: transparent;
        border: 1px solid gray;
        border-radius: 3px;
        padding: 0.75rem 1rem;
        /*width: 40px;*/
        /*height: 40px;*/
    }

    .page-button:hover {
        cursor: pointer;
    }

    .current-page-button {
        background-color: var(--primary-color);
        color: var(--on-primary-color);
    }
</style>