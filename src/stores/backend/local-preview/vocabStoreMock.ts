import {VocabLevelSchema} from "dzelda-common";
import {defineStore} from "pinia";
import {getAcceptablyRandomId} from "@/utils.js";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";
import {escapeRegExp} from "dzelda-common/build/src/utils/utils.js";

export const useVocabStoreMock = defineStore("vocabStoreMock", {
        actions: {
            async fetchTextVocabs(pathParams: { textId: number }, queryParams: {}) {
                const localPreviewStore = useLocalPreviewStore();
                const previewDb = await localPreviewStore.getPreviewDb();

                const text = await previewDb.get("texts", pathParams.textId);
                if (!text)
                    return;
                const textVocabs = await localPreviewStore.populateIdsArray(text.vocabs, "vocabs");
                for (const vocab of textVocabs) {
                    vocab.meanings = await previewDb.getAllFromIndex("meanings", "vocabIndex", vocab.id);
                    vocab.learnerMeanings = await localPreviewStore.populateIdsArray(vocab.learnerMeanings, "meanings");
                }
                return textVocabs;
            },
            async addVocabToUser(body: { vocabId: number, level?: VocabLevelSchema }) {
                return await this.updateUserVocab({vocabId: body.vocabId}, {level: body.level ?? VocabLevelSchema.LEVEL1});
            },
            async updateUserVocab(pathParams: { vocabId: number }, body: { level?: VocabLevelSchema, notes?: string }) {
                const localPreviewStore = useLocalPreviewStore();
                const previewDb = await localPreviewStore.getPreviewDb();
                const vocab = await previewDb.get("vocabs", pathParams.vocabId);
                if (!vocab)
                    return;
                if (body.level !== undefined)
                    vocab.level = body.level;
                if (body.notes !== undefined)
                    vocab.notes = body.notes;
                await previewDb.put("vocabs", vocab);
                return vocab;
            },
            async removeVocabFromUser(pathParams: { vocabId: number }) {
                const localPreviewStore = useLocalPreviewStore();
                const previewDb = await localPreviewStore.getPreviewDb();
                const vocab = await previewDb.get("vocabs", pathParams.vocabId);
                if (!vocab)
                    return;
                vocab.level = VocabLevelSchema.NEW;
                vocab.notes = null;
                vocab.learnerMeanings = [];
                await previewDb.put("vocabs", vocab);
            },
            async createVocab(body: { text: string, languageCode: string, isPhrase: boolean }) {
                const localPreviewStore = useLocalPreviewStore();
                const previewDb = await localPreviewStore.getPreviewDb();
                const newVocab = {
                    id: getAcceptablyRandomId(),
                    text: body.text,
                    isPhrase: body.isPhrase,
                    language: body.languageCode,
                    learnersCount: 0,
                    textsCount: 0,
                    level: VocabLevelSchema.NEW,
                    notes: null,
                    learnerMeanings: [],
                    ttsPronunciations: [],
                    tags: [],
                    rootForms: [],
                };
                await previewDb.add("vocabs", newVocab);

                const allTexts = await previewDb.getAllFromIndex("texts", "languageIndex", newVocab.language);
                const vocabFindRegex = new RegExp(`(\\s|^)${escapeRegExp(newVocab.text)}(\\s|$)`);
                for (const text of allTexts) {
                    if (text.parsedTitle.match(vocabFindRegex) || text.parsedContent.match(vocabFindRegex)) {
                        text.vocabs.push(newVocab.id);
                        await previewDb.put("texts", text);
                    }
                }
                return newVocab;
            },
            async fetchUserVocab(pathParams: { vocabId: number }) {
                const localPreviewStore = useLocalPreviewStore();
                const previewDb = await localPreviewStore.getPreviewDb();
                const vocab = await previewDb.get("vocabs", pathParams.vocabId);
                if (!vocab || vocab.level == VocabLevelSchema.NEW)
                    return;
                return {
                    ...vocab,
                    meanings: await previewDb.getAllFromIndex("meanings", "vocabIndex", vocab.id),
                    learnerMeanings: await localPreviewStore.populateIdsArray(vocab.learnerMeanings, "meanings"),
                };
            }
        }
    }
);
