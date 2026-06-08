export let fileState = $state({ files: [], activeFile: "" })


fetch(`${import.meta.env.VITE_API_URL}/get-files`)
  .then((res) => res.json())
  .then((data) => (fileState.files = data.fileList || []))
  .catch((err) => console.log(err));


