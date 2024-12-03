import {home, work, visit, park } from "./constants.js";
export const getCategory = (category)=> {
    switch (category)
    {
        case "home": return "Home"; 
        case "work": return "Work";
        case "park": return "Parking Lot";
        case "visit": return "Travel";
    }
};// input value larini render ediyordu. category bu oldugunda sunu render et isini yaptik. if else ile de yapilirdi. bu daha kolay yolu

export const getIcon = (category)=> {
    switch (category)
    {
        case "home": return home;
        case "work": return work;
        case "park": return park;
        case "visit": return visit;
}
}