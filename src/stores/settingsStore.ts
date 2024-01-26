import {defineStore} from "pinia";
import {useStorage} from "@vueuse/core";

export const useLocalSettingsStore = defineStore("settings", {
    state() {
        const defaultTheme = window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ? "black" : "light";
        return {
            theme: useStorage("theme", defaultTheme),
        };
    },
    getters: {
        isLightTheme(state) {
            return state.theme == "light";
        },
        isDarkTheme(state) {
            return state.theme == "dark" || state.theme == "black";
        },
    }
});
