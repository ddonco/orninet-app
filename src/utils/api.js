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

export function getYoloStatus() {
  return fetch("/api/yolo_status")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No status data available.");
      }

      return result;
    });
}

export function startYoloStatus() {
  return fetch("/api/start_yolo")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No status data available.");
      }

      return result;
    });
}

export function stopYoloStatus() {
  return fetch("/api/stop_yolo")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No status data available.");
      }

      return result;
    });
}

export function closeVideoStream() {
  return fetch("/api/video_stop")
    .then((res) => res.json())
    .then((result) => {
      if (result.message) {
        throw new Error("No video stream available.")
      }

      return result;
    });
}