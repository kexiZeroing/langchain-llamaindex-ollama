async function fetchWithJinaReader(url) {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching with Jina Reader:', error);
    throw error;
  }
}

fetchWithJinaReader('https://kexizeroing.github.io')
  .then(data => console.log(data))
  .catch(error => console.error(error));
  