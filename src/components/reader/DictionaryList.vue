<template>
    <h5>Dictionaries</h5>
    <ol class="dictionaries">
        <li>Dictionary 1</li>
    </ol>
</template>

<script>
    export default {
        name: "DictionariesList"
    }
</script>

<style scoped>
    .dictionaries {
        display: flex;
        flex-direction: column;
        row-gap: 0.25rem;
    }

    .dictionaries > li {
        background-color: #FFE675;
        padding: 15px 10px;
        cursor: pointer;
        font-size: 1rem;
        color: black;
        border-radius: 5px;
        width: 100%;
    }
</style>