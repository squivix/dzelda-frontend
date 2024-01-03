import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";

export const useLocalSettingsStore = defineStore("settings", {
    state() {
        return {
            theme: useStorage("theme", "light"),
        };
    },
});
