<template>
        <search-filter @onSearchSubmitted="onSearchSubmitted"
                       @onFiltersApplied="onFiltersApplied"
                       :initial-search-query="initialSearchQuery">
            <template v-slot:filters>

            </template>
        </search-filter>
</template>

<script>
    import SearchFilter from "@/components/general/ui/SearchFilter";

    export default {
        name: "LibrarySearchFilter",
        components: {SearchFilter},
        emits: ['onSearchSubmitted', 'onFiltersApplied'],
        props: {
            initialSearchQuery: {
                type: String,
                required: false,
                default: "",
            }
        },
        methods: {
            onSearchSubmitted() {
                this.$emit("onSearchSubmitted");
            }, onFiltersApplied() {
                this.$emit("onFiltersApplied");
            },
        }

    }
</script>

<style scoped>

</style>