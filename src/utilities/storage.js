export const isDistributor = () => {
  try {
    const serialized = localStorage.getItem("isDist");
    if (serialized === null) return false;
    const data = JSON.parse(serialized);
    if (data === "true") return true;
    return false;
  } catch (err) {
    return false;
  }
};

export const setIsDistributor = (data) => {
  try {
    var val = "false";
    if (data) val = "true";
    const serialized = JSON.stringify(val);
    localStorage.setItem("isDist", serialized);
  } catch (err) {}
};

export const isLogedIn = () => {
  try {
    const serialized = localStorage.getItem("isLoged");
    if (serialized === null) return false;
    const data = JSON.parse(serialized);
    if (data === "true") return true;
    return false;
  } catch (err) {
    return false;
  }
};

export const setIsLogedIn = (data) => {
  try {
    var val = "false";
    if (data) val = "true";
    const serialized = JSON.stringify(val);
    localStorage.setItem("isLoged", serialized);
  } catch (err) {
    console.log(err);
  }
};

export const getWhichMealTab = () => {
  try {
    const serialized = localStorage.getItem("whichMealTab");
    if (serialized === null) return "lunch";
    return JSON.parse(serialized);
  } catch (err) {
    return "lunch";
  }
};

export const setWhichMealTab = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("whichMealTab", serialized);
  } catch (err) {}
};
