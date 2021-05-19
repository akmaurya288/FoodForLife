export const getMealDeliveryData = () => {
  try {
    const serialized = localStorage.getItem("MealDeliveryData");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch (err) {
    return {};
  }
};

export const setMealDeliveryData = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("MealDeliveryData", serialized);
  } catch (err) {}
};

export const getDeliveryMealType = () => {
  try {
    const serialized = localStorage.getItem("DeliveryMealType");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch (err) {
    return {};
  }
};

export const setDeliveryMealType = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("DeliveryMealType", serialized);
  } catch (err) {}
};

export const getRouteData = () => {
  try {
    const serialized = localStorage.getItem("RouteData");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch (err) {
    return {};
  }
};

export const setRouteData = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("RouteData", serialized);
  } catch (err) {}
};

export const getRouteGeoJson = () => {
  try {
    const serialized = localStorage.getItem("RouteGeoJson");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch (err) {
    return {};
  }
};

export const setRouteGeoJson = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("RouteGeoJson", serialized);
  } catch (err) {}
};

export const getDirectionWaypoints = () => {
  try {
    const serialized = localStorage.getItem("DirectionWaypoints");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch (err) {
    return {};
  }
};

export const setDirectionWaypoints = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("DirectionWaypoints", serialized);
  } catch (err) {}
};

export const getDriverMealList = () => {
  try {
    const serialized = localStorage.getItem("DriverMealList");
    if (serialized === null) return {};
    return JSON.parse(serialized);
  } catch (err) {
    return {};
  }
};

export const setDriverMealList = (data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem("DriverMealList", serialized);
  } catch (err) {}
};

export const isRouteCreated = () => {
  try {
    const serialized = localStorage.getItem("isRouteCreated");
    if (serialized === null) return false;
    const data = JSON.parse(serialized);
    if (data === "true") return true;
    return false;
  } catch (err) {
    return false;
  }
};

export const setIsRouteCreated = (data) => {
  try {
    var val = "false";
    if (data) val = "true";
    const serialized = JSON.stringify(val);
    localStorage.setItem("isRouteCreated", serialized);
  } catch (err) {}
};

export const isAdmin = () => {
  try {
    const serialized = localStorage.getItem("isAdmin");
    if (serialized === null) return false;
    const data = JSON.parse(serialized);
    if (data === "true") return true;
    return false;
  } catch (err) {
    return false;
  }
};

export const setIsAdmin = (data) => {
  try {
    var val = "false";
    if (data) val = "true";
    const serialized = JSON.stringify(val);
    localStorage.setItem("isAdmin", serialized);
  } catch (err) {}
};

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
