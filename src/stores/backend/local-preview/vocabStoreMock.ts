import {VocabLevelSchema} from "dzelda-common";
import {defineStore} from "pinia";
import {getRandomInt} from "@/utils.js";
import {useLocalPreviewStore} from "@/stores/backend/local-preview/localPreviewStore.js";
import {escapeRegExp} from "dzelda-common/build/src/utils/utils.js";

export const useVocabStoreMock = defineStore("vocabStoreMock", {
        actions: {
            async fetchLessonVocabs(pathParams: { lessonId: number }, queryParams: {}) {
                const localPreviewStore = useLocalPreviewStore();
                const previewDb = await localPreviewStore.getPreviewDb();

                const lesson = await previewDb.get("lessons", pathParams.lessonId);
                if (!lesson)
                    return;
                const lessonVocabs = await localPreviewStore.populateIdsArray(lesson.vocabs, "vocabs");
                for (const vocab of lessonVocabs) {
                    vocab.meanings = await previewDb.getAllFromIndex("meanings", "vocabIndex", vocab.id);
                    vocab.learnerMeanings = await localPreviewStore.populateIdsArray(vocab.learnerMeanings, "meanings");
                }
                return lessonVocabs;
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
                    id: getRandomInt(100000000000, 999999999999),
                    text: body.text,
                    isPhrase: body.isPhrase,
                    language: body.languageCode,
                    learnersCount: 0,
                    lessonsCount: 0,
                    level: VocabLevelSchema.NEW,
                    notes: null,
                    learnerMeanings: []
                };
                await previewDb.add("vocabs", newVocab);

                const allLessons = await previewDb.getAllFromIndex("lessons", "languageIndex", newVocab.language);
                const vocabFindRegex = new RegExp(`(\\s|^)${escapeRegExp(newVocab.text)}(\\s|$)`);
                for (const lesson of allLessons) {
                    if (lesson.parsedTitle.match(vocabFindRegex) || lesson.parsedText.match(vocabFindRegex)) {
                        lesson.vocabs.push(newVocab.id);
                        await previewDb.put("lessons", lesson);
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
