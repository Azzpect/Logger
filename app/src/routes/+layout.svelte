<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  import { fileState } from "./file.svelte";
  let { children } = $props();
  

</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="stylesheet" href="/styles.css" />
</svelte:head>

<div id="container">
  <div id="sidebar">
    <h2>Log Files</h2>
    <ul id="file-list">
      {#each fileState.files as file}
        <a 
          class={fileState.activeFile === file ? "active" : ""} href="/{file}" onclick={() => fileState.activeFile = file}
          style={fileState.activeFile == file ? "background-color: var(--highlight);color: var(--bg);" : ""}
          >
          {file}
        </a>
      {/each}
    </ul>
  </div>

  <div id="logger">
    <h2>Logger</h2>
    {@render children()}
  </div>
</div>
