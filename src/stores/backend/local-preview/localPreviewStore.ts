import {defineStore} from "pinia";
import {DBSchema, deleteDB, IDBPDatabase, openDB} from "idb";
import {LanguageLevelSchema, VocabLevelSchema} from "dzelda-common";

export type MeaningRow = {
    id: number,
    text: string,
    learnersCount: number,
    addedBy: string,
    language: string,
    addedOn: string,
    vocab: number,
};
export type VocabRow = {
    id: number,
    text: string,
    isPhrase: boolean,
    level: VocabLevelSchema,
    notes: string | null,
    language: string,
    learnerMeanings: number[],
};
export type LessonRow = {
    id: number,
    title: string,
    text: string,
    parsedTitle: string,
    parsedText: string,
    language: string,
    addedBy: string,
    isPublic: boolean,
    level: LanguageLevelSchema,
    learnersCount: number
    course: null,
    addedOn: string,
    audio: string,
    image: string,
    translatedTitle: string,
    vocabs: number[],
};
export type PreviewLesson = {
    id: number,
    title: string,
    languageVersions: Record<string, number>
}

interface PreviewDBSchema extends DBSchema {
    meanings: {
        key: number;
        value: MeaningRow
        indexes: {
            vocabIndex: number,
        };
    };
    vocabs: {
        key: number;
        value: VocabRow
    };
    lessons: {
        key: number;
        value: LessonRow;
        indexes: {
            languageIndex: string,
        };
    };
    previews: {
        key: number;
        value: PreviewLesson
    };
    dictionaries: {
        key: number;
        value: {};
        indexes: {
            languageIndex: string,
        };
    };
}

async function seedData(db: IDBPDatabase<PreviewDBSchema>, url: string, objectStore: "meanings" | "vocabs" | "lessons" | "previews" | "dictionaries") {
    const response = await fetch(url);
    const data = await response.json();
    const transaction = db.transaction(objectStore, "readwrite");
    await Promise.all([
        ...data.map((m: any) => transaction.store.add(m)),
        transaction.done
    ]);
}


export const useLocalPreviewStore = defineStore("localPreviewStore", {
    state() {
        return {
            previewDb: null as null | IDBPDatabase<PreviewDBSchema>
        };
    },
    actions: {
        async getPreviewDb(): Promise<IDBPDatabase<PreviewDBSchema>> {
            if (this.previewDb === null) {
                return new Promise((resolve) => {
                    const currentVersion = 1;
                    openDB<PreviewDBSchema>("PreviewData", currentVersion, {
                        upgrade(db, newVersion, oldVersion) {
                            for (const store of db.objectStoreNames)
                                db.deleteObjectStore(store);
                            const meaningsStore = db.createObjectStore("meanings", {keyPath: "id"});
                            meaningsStore.createIndex("vocabIndex", "vocab");
                            db.createObjectStore("vocabs", {keyPath: "id"});
                            const lessonsStore = db.createObjectStore("lessons", {keyPath: "id"});
                            lessonsStore.createIndex("languageIndex", "language");
                            db.createObjectStore("previews", {keyPath: "id"});
                            const dictionariesStore = db.createObjectStore("dictionaries", {keyPath: "id"});
                            dictionariesStore.createIndex("languageIndex", "language");
                        }
                    }).then(async (db) => {
                        if (await db.count("meanings") == 0)
                            await seedData(db, "data/preview/meanings.json", "meanings");
                        if (await db.count("vocabs") == 0)
                            await seedData(db, "data/preview/vocabs.json", "vocabs");
                        if (await db.count("lessons") == 0)
                            await seedData(db, "data/preview/lessons.json", "lessons");
                        if (await db.count("previews") == 0)
                            await seedData(db, "data/preview/previews.json", "previews");
                        if (await db.count("dictionaries") == 0)
                            await seedData(db, "data/preview/dictionaries.json", "dictionaries");
                        this.previewDb = db;
                        resolve(db);
                    });
                });
            } else
                return this.previewDb;
        },
        async populateIdsArray(idsArray: number[], foreignObjectStore: "meanings" | "vocabs" | "lessons" | "previews" | "dictionaries") {
            const db = await this.getPreviewDb();
            const idsMap: Record<number, any> = {};
            const results: object[] = [];
            for (const id of idsArray) {
                if (!(id in idsMap))
                    idsMap[id] = await db.get(foreignObjectStore, id);
                results.push(idsMap[id]);
            }
            return results as any;
        }
    }
});
