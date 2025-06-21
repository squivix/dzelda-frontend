import {defineStore} from "pinia";
import {DBSchema, IDBPDatabase, openDB} from "idb";
import {AttributionSchema, LanguageLevelSchema, VocabLevelSchema, VocabTagSchema} from "dzelda-common";

export type MeaningRow = {
    id: number,
    text: string,
    learnersCount: number,
    addedBy: string,
    language: string,
    addedOn: string,
    vocab: number,
    attributionSource: number | null,
    attribution: AttributionSchema | null
};
export type VocabRow = {
    id: number,
    text: string,
    isPhrase: boolean,
    level: VocabLevelSchema,
    notes: string | null,
    language: string,
    learnerMeanings: number[],
    ttsPronunciationUrl: string | null,
    tags: VocabTagSchema[],
    rootForms: string[],
    learnersCount: number,
};

export type LanguageRow = {
    id: number
    name: string
    greeting: string
    code: string
    secondSpeakersCount: number
    flagCircular: string
    flag: string
    flagEmoji: string
    color: string
    isSupported: boolean
    learnersCount: number
    levelThresholds: {
        beginner1: number;
        beginner2: number;
        intermediate1: number;
        intermediate2: number;
        advanced1: number;
        advanced2: number;
    }
}

export type TextRow = {
    id: number,
    title: string,
    content: string,
    parsedTitle: string,
    parsedContent: string,
    language: string,
    addedBy: string,
    isPublic: boolean,
    level: LanguageLevelSchema,
    learnersCount: number
    collection: null,
    addedOn: string,
    audio: string,
    image: string,
    translatedTitle: string,
    vocabs: number[],
};
export type PreviewText = {
    id: number,
    title: string,
    languageVersions: Record<string, number>
}
export type AttributionSourceRow = {
    id: number,
    name: string,
    url: string | undefined,
    logoUrl: string | undefined
}

interface PreviewDBSchema extends DBSchema {
    meanings: {
        key: number;
        value: MeaningRow
        indexes: {
            vocabIndex: number,
            translationLanguageIndex: string,
            vocabLanguageIndex: [number, string]
        };
    };
    vocabs: {
        key: number;
        value: VocabRow
    };
    languages: {
        key: number,
        value: LanguageRow
    },
    texts: {
        key: number;
        value: TextRow;
        indexes: {
            languageIndex: string,
        };
    };
    previews: {
        key: number;
        value: PreviewText
    };
    dictionaries: {
        key: number;
        value: {};
        indexes: {
            languageIndex: string,
        };
    };
    attributionSources: {
        key: number;
        value: AttributionSourceRow
    }
}

async function seedData(db: IDBPDatabase<PreviewDBSchema>, url: string, objectStore: "meanings" | "vocabs" | "texts" | "languages" | "previews" | "dictionaries"|"attributionSources") {
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
        async clearPreviewDb() {
            this.previewDb = null;
        },
        async getPreviewDb(): Promise<IDBPDatabase<PreviewDBSchema>> {
            if (this.previewDb) {

            }
            if (this.previewDb === null) {
                return new Promise((resolve) => {
                    const currentVersion = 2;
                    openDB<PreviewDBSchema>("PreviewData", currentVersion, {
                        upgrade(db, newVersion, oldVersion) {
                            for (const store of db.objectStoreNames)
                                db.deleteObjectStore(store);
                            const meaningsStore = db.createObjectStore("meanings", {keyPath: "id"});
                            meaningsStore.createIndex("vocabIndex", "vocab");
                            meaningsStore.createIndex("translationLanguageIndex", "language");
                            meaningsStore.createIndex("vocabLanguageIndex", ["vocab", "language"]);
                            db.createObjectStore("vocabs", {keyPath: "id"});
                            db.createObjectStore("languages", {keyPath: "id"});
                            const textsStore = db.createObjectStore("texts", {keyPath: "id"});
                            textsStore.createIndex("languageIndex", "language");
                            db.createObjectStore("previews", {keyPath: "id"});
                            const dictionariesStore = db.createObjectStore("dictionaries", {keyPath: "id"});
                            dictionariesStore.createIndex("languageIndex", "language");
                            db.createObjectStore("attributionSources", {keyPath: "id"});
                        },
                        terminated() {
                            useLocalPreviewStore().clearPreviewDb();
                        }
                    }).then(async (db) => {
                        if (await db.count("meanings") == 0)
                            await seedData(db, "data/preview/meanings.json", "meanings");
                        if (await db.count("vocabs") == 0)
                            await seedData(db, "data/preview/vocabs.json", "vocabs");
                        if (await db.count("languages") == 0)
                            await seedData(db, "data/preview/languages.json", "languages");
                        if (await db.count("texts") == 0)
                            await seedData(db, "data/preview/texts.json", "texts");
                        if (await db.count("previews") == 0)
                            await seedData(db, "data/preview/previews.json", "previews");
                        if (await db.count("dictionaries") == 0)
                            await seedData(db, "data/preview/dictionaries.json", "dictionaries");
                        if (await db.count("attributionSources") == 0)
                            await seedData(db, "data/preview/attribution-sources.json", "attributionSources");
                        this.previewDb = db;
                        resolve(db);
                    });
                });
            } else
                return this.previewDb;
        },
        async populateIdsArray(idsArray: number[], foreignObjectStore: "meanings" | "vocabs" | "texts" | "languages" | "previews" | "dictionaries") {
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
