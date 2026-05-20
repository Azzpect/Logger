<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();

  let files = $state([]);
  let activeFile = $derived("");

  $effect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/get-files`)
      .then((res) => res.json())
      .then((data) => (files = data.fileList || []))
      .catch((err) => console.log(err));
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="stylesheet" href="/styles.css" />
</svelte:head>

<div id="container">
  <div id="sidebar">
    <h2>Log Files</h2>
    <ul id="file-list">
      {#each files as file}
        <a class={activeFile === file ? "active" : ""} href="/{file}" onclick={() => activeFile = file}>{file}</a>
      {/each}
    </ul>
  </div>

  <div id="logger">
    <h2>Logger</h2>
    {@render children()}
  </div>
</div>
