<template>
    <div class="pagination-div">
        <form id="per-page-form">
            <label for="per-page-select" v-if="perPageSelectLabel">{{perPageSelectLabel}}</label>
            <select id="per-page-select" v-model="maxPerPage">
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

    export default {
        name: "PaginationControls",
        emits: ['onRefetchNeeded', 'update:modelValue'],
        components: {BasePageSelector},
        props: {
            modelValue: {
                type: Object,
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
        }, watch: {
            $data: {
                handler: function (newVal) {
                    this.$emit("update:modelValue", newVal);
                },
                deep: true,
            },
            async maxPerPage() {
                this.goToPage(1);
            },
            '$route.query': async function (newVal, oldVal) {
                if (newVal.page === oldVal.page || !oldVal)
                    this.goToPage(1);
                else
                    this.updateStateFromQueryParams(newVal);
            }
        },
        data() {
            return {
                // maxPerPage: this.perPageSelectOptions[0],
                // currentPage: 1,
                maxPerPage: this.modelValue.maxPerPage,
                currentPage: this.modelValue.currentPage,
            };
        },
        mounted() {
            // this.updateStateFromQueryParams();
        },
        methods: {
            goToPage(page) {
                this.currentPage = page;
                this.updateQueryParams();
            },
            updateQueryParams() {
                this.$router.push({
                    ...this.$route,
                    query: {
                        ...this.$route.query,
                        page: this.currentPage,
                        maxPerPage: this.maxPerPage
                    }
                });
            },
            updateStateFromQueryParams(queryParams) {
                if (!queryParams)
                    queryParams = this.$route.query;
                const queryParamPage = Number(queryParams.page);

                if (!Number.isNaN(queryParamPage)) {
                    if (queryParamPage > 0 && queryParamPage <= this.pageCount)
                        this.currentPage = queryParamPage;
                    else
                        this.goToPage(1);
                }

                const queryParamMaxPerPage = Number(queryParams.maxPerPage);

                if (!Number.isNaN(queryParamMaxPerPage)) {
                    if (this.perPageSelectOptions.includes(queryParamMaxPerPage))
                        this.maxPerPage = queryParamMaxPerPage;
                    else
                        this.maxPerPage = this.perPageSelectOptions[0];
                }
            }
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