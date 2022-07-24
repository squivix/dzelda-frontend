<template>
    <base-card title="Settings" class="settings-base-card">
        <template v-slot:content>
            <div class="content">
                <aside>
                    <ul class="nav-panel">
                        <li>Account</li>
                        <li>Languages</li>
                        <li>Notifications</li>
                    </ul>
                </aside>
                <div class="settings-tab">
                    <p>There should be some settings here</p>
                </div>
            </div>
        </template>

    </base-card>
</template>

<script>
    import BaseCard from "@/components/ui/BaseCard";

    export default {
        name: "SettingsPage",
        components: {BaseCard}
    }
</script>

<style scoped>
    .settings-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;
    }

    .content {
        display: flex;
        height: 50vh;
    }

    .nav-panel {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        height: 100%;
        border-inline-end: 1px solid gray;
        padding-inline-end: 1rem;
        flex: 1;
    }

    .settings-tab {
        padding-inline-start: 1rem;
        flex: 2;
    }

    .nav-panel li {

    }
</style>