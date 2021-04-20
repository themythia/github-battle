export function fetchPopularRepos(language) {
  const endpoint = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) {
        throw new Error(data.message);
      }
      //data.items is an array of objects
      //[{},{},{},...]
      return data.items;
    });
}
