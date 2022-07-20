<template>
    <div class="pagination-div">
        <form id="per-page-form">
            <label for="per-page-select" v-if="perPageSelectLabel">{{perPageSelectLabel}}</label>
            <select id="per-page-select"
                    :value="maxPerPage"
                    @change="updateQueryParams({maxPerPage:$event.target.value})">
                <option v-for="option in perPageSelectOptions" :key="option" :value="option">{{option}}</option>
            </select>
        </form>
        <base-page-selector v-if="!!pageCount"
                            :current-page="currentPage"
                            :pageCount="pageCount"
                            :shown-count="Math.min(5,pageCount)"
                            @onPageClicked="goToPage">
        </base-page-selector>
    </div>
</template>

<script>
    import BasePageSelector from "@/components/ui/BasePageSelector";
    import {updateQueryParams} from "@/components/reader/shared";

    export default {
        name: "PaginationControls",
        components: {BasePageSelector},
        props: {
            maxPerPage: {
                type: Number,
                required: true
            },
            currentPage: {
                type: Number,
                required: true
            },
            perPageSelectOptions: {
                type: Array,
                required: false,
                default() {
                    return [25, 50, 100, 150, 200]
                },
            },
            perPageSelectLabel: {
                type: String,
                required: false,
                default: null,
            },
            pageCount: {
                type: Number,
                required: true,
            },
        },
        watch: {
            async maxPerPage() {
                this.goToPage(1);
            },
        },
        methods: {
            goToPage(page) {
                this.updateQueryParams({page});
            },
            updateQueryParams
        }
    }

    // interface/mixin-like way for all hosts of the PaginationControls component to have the necessary computed properties
    export const paginationControlsHost = {
        computed: {
            currentPage: {
                get() {
                    const queryPage = Number(this.$route.query.page);
                    if (!Number.isNaN(queryPage) && queryPage > 0 && queryPage <= this.pageCount)
                        return queryPage;
                    else
                        return 1;
                },
                set(newVal) {
                    this.updateQueryParams({page: newVal})
                }
            }, maxPerPage() {
                const queryMaxPerPage = Number(this.$route.query.maxPerPage);
                if (!Number.isNaN(queryMaxPerPage) && this.PER_PAGE_SELECT_OPTIONS.includes(queryMaxPerPage))
                    return queryMaxPerPage;
                else
                    return this.PER_PAGE_SELECT_OPTIONS[0];
            },
        },
        methods: {
            updateQueryParams
        }
    }
</script>

<style scoped>

    .pagination-div {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }

    #per-page-form {
        display: flex;
        flex-direction: row;
        column-gap: 0.5rem;
        justify-content: flex-start;
        align-items: center;
    }

</style>