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

export function getYolov3Status() {
  return fetch("/api/yolov3_status")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No status data available.");
      }

      return result;
    });
}

export function startYolov3Status() {
  return fetch("/api/start_yolov3")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No status data available.");
      }

      return result;
    });
}

export function stopYolov3Status() {
  return fetch("/api/stop_yolov3")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No status data available.");
      }

      return result;
    });
}