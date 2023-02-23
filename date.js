exports.dayString = function () {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    hour12: false,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
