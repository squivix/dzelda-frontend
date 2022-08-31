import {useVocabStore} from "@/stores/vocab";

export async function postUserVocab(vocabId) {
    const vocabStore = useVocabStore();
    return await vocabStore.postUserVocab({
        vocabId: vocabId,
    });
}

export function getTextElements(paragraph, regex) {
    //[^\p{L}\d]
    return paragraph.split(regex ?? /([^\p{L}\d])/gu).filter((word) => word !== '');
    // return paragraph.split(/(\s|[^a-zA-Z\d\s:])+/g);
}

export async function updateQueryParams(updatedQuery) {
    await this.$router.push({
        ...this.$route,
        query: {
            ...this.$route.query,
            ...updatedQuery,
        }
    });
}
