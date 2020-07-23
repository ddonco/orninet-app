export function getHomeData() {
  return fetch("/api/home")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No data available.");
      }

      return result;
    });
}

export function getArchiveData(page) {
  return fetch(`/api/archive?page=${page}`)
  .then((res) => res.json())
  .then((result) => {
    if (result.message) {
      throw new Error("No archive data available.")
    }

    return result;
  });
}

export function getSearchData(query, page) {
  return fetch(`/api/search?query=${query}&page=${page}`)
  .then((res) => res.json())
  .then((result) => {
    if (result.message) {
      throw new Error("No archive data available.")
    }

    return result;
  });
}