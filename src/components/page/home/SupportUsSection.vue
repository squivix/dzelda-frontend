<template>
  <section>
    <h2>Support us</h2>
    <nav>
      <article>
        <a href="https://github.com/squivix/dzelda-frontend">
          <inline-svg class="icon logo" :src="githubLogo" alt="github link"/>
        </a>
        <h3>Help with development</h3>
      </article>
      <article>
        <div class="multiple-icons-div">
          <a href="https://www.reddit.com/r/dzelda/">
            <inline-svg class="icon logo" :src="redditLogo" alt="reddit community link"/>
          </a>
          <a href="https://discord.gg/FbpCMw475A">
            <inline-svg class="icon logo" :src="discordLogo" alt="reddit community link"/>
          </a>
        </div>
        <h3>Join our communities</h3>
      </article>
      <article>
        <div class="multiple-icons-div">
          <a href="mailto:devintheamateurdevin@gmail.com">
            <inline-svg class="icon" :src="icons.email" alt="email developer link"/>
          </a>
          <a href="https://forms.gle/Rw8fCMHMzNNwuTbe8">
            <inline-svg class="icon logo" :src="googleFormsLogo" alt="google forms feedback link"/>
          </a>
        </div>
        <h3>Send Feedback</h3>
      </article>
    </nav>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import redditLogo from "@/assets/images/reddit-logo.svg";
import githubLogo from "@/assets/images/github-logo.svg";
import discordLogo from "@/assets/images/discord-logo.svg";
import googleFormsLogo from "@/assets/images/google-forms-logo.svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "SupportUsSection",
  components: {InlineSvg},
  setup() {
    return {
      icons,
      redditLogo,
      githubLogo,
      discordLogo,
      googleFormsLogo,
    };
  }
});
</script>

<style scoped>
section {
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
}

nav {
  display: grid;
  grid-template-columns: repeat( 3, 1fr);
  flex-direction: row;
  column-gap: max(2rem, 5vw);
  margin-top: 10vh;
  margin-bottom: 10vh;
  justify-content: center;
}

a {
  color: var(--on-background-color);
}

article {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1rem;
}

h3 {
  font-size: 1.25rem;
  text-align: center;
}

.icon {
  width: 75px;
  height: 75px;
}

.icon:not(.logo) {
  color: var(--primary-color);
}

.multiple-icons-div {
  display: flex;
  column-gap: 0.5rem;
  justify-content: center;
}

.multiple-icons-div .icon {
  flex-basis: 75px;

}

@media screen and (max-width: 750px) {
  nav {
    display: flex;
    flex-direction: column;
    row-gap: 5rem;
    margin-top: 5vh;
  }
}
</style>
