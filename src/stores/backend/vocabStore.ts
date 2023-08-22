import {defineStore} from "pinia";
import {useStore} from "@/stores/backend/rootStore.js";

export const useVocabStore = defineStore("vocab", {
    actions: {
        async fetchUserVocabs(queryParams: { languageCode?: string, level?: (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6)[], searchQuery?: string, pageSize?: number, page?: number } = {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.getUsersUsernameVocabs("me", queryParams))

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async createVocab(body: { text: string, languageCode: string, isPhrase: boolean }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.vocabs.postVocabs({
                text: body.text,
                languageCode: body.languageCode,
                isPhrase: body.isPhrase
            }))

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async addVocabToUser(body: { vocabId: number }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.postUsersUsernameVocabs("me", {
                vocabId: body.vocabId
            }));

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async updateUserVocab(pathParams: { vocabId: number }, body: { level: (-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6) }) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.users.patchUsersUsernameVocabs("me", pathParams.vocabId, {
                level: body.level
            }));

            // handle your 4XX errors as you may
            //...

            return response.data;
        },
        async fetchLessonVocabs(pathParams: { lessonId: number }, queryParams: {}) {
            const store = useStore();
            const response = await store.fetchCustom((api) => api.lessons.getLessonsLessonIdVocabs(pathParams.lessonId, queryParams))

            // handle your 4XX errors as you may
            //...

            return response.data;
        }
    }
})