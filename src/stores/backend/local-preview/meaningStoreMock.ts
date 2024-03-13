import {defineStore} from "pinia";
import {MeaningSchema} from "dzelda-common";
import {getAcceptablyRandomId} from "@/utils.js";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";

export const useMeaningStoreMock = defineStore("meaningStoreMock", {
    state() {
        return {
            userMeanings: [] as { meaningId: number, }[],
            newMeanings: [] as (Omit<MeaningSchema, "vocab"> & { vocab: number })[],
        };
    },

    actions: {
        async addMeaningToUser(body: { meaningId: number }) {
            const localPreviewStore = useLocalPreviewStore();
            const previewDb = await localPreviewStore.getPreviewDb();
            const meaning = await previewDb.get("meanings", body.meaningId);
            if (!meaning)
                return;
            const meaningVocab = await previewDb.get("vocabs", meaning.vocab);
            if (!meaningVocab)
                return;
            if (meaningVocab.learnerMeanings.find(m => m === body.meaningId))
                return meaning;
            meaningVocab.learnerMeanings.push(meaning.id);
            await previewDb.put("vocabs", meaningVocab);
            return meaning;
        },
        async createMeaning(body: { text: string, vocabId: number, languageCode: string }) {
            const localPreviewStore = useLocalPreviewStore();
            const previewDb = await localPreviewStore.getPreviewDb();
            const existingMeanings = await previewDb.getAllFromIndex("meanings", "vocabLanguageIndex", [body.vocabId, body.languageCode]);
            const existingMeaning = existingMeanings.find(m => m.text == body.text);
            if (existingMeaning)
                return existingMeaning;
            const newMeaning = {
                id: getAcceptablyRandomId(),
                vocab: body.vocabId,
                text: body.text,
                addedBy: "anonymous",
                language: body.languageCode,
                addedOn: new Date().toISOString(),
                learnersCount: 0,
                attributionSource: null,
                attribution: null
            };
            await previewDb.add("meanings", newMeaning);
            return newMeaning;
        },
        async deleteMeaningFromUser(pathParams: { meaningId: number }) {
            const localPreviewStore = useLocalPreviewStore();
            const previewDb = await localPreviewStore.getPreviewDb();
            const meaning = await previewDb.get("meanings", pathParams.meaningId);
            if (!meaning)
                return;
            const meaningVocab = await previewDb.get("vocabs", meaning.vocab);
            if (!meaningVocab)
                return;
            const index = meaningVocab.learnerMeanings.findIndex(mId => mId == pathParams.meaningId);
            if (index == -1)
                return;
            meaningVocab.learnerMeanings.splice(index, 1);
            await previewDb.put("vocabs", meaningVocab);
        }
    }
});
