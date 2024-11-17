import toast from "react-hot-toast";

// example data: "["The Solar System", "The Sun is at the center", "There are eight planets", "The planets are divided into two groups: terrestrial and gas giants"]"

export const parseData = (data: string) => {
  try {
    const parsedData = JSON.parse(data);

    const topic = parsedData[0];

    // Split points based on \n
    const points: string[] = parsedData.slice(1);

    return { topic, points };
  } catch (error) {
    toast.error("Error parsing summary data", {
      duration: 3000,
      position: "top-center",
    });
    return { topic: "", points: [] };
  }
};
