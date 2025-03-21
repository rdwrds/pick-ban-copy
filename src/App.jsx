import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Champ, Minimap, Sidebar, PaintCanvas } from "./components";
import PickProvider, { PickContext } from "./components/PickProvider.jsx";

function App() {
  const CHAMP_DATA_API =
    "https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json";

  const { state, dispatch } = useContext(PickContext);

  //to prep and hold champ data
  const [data, setData] = useState(null);
  const [champs, setChamps] = useState(null);

  const fetchData = async () => {
    const resp = await fetch(CHAMP_DATA_API);

    try {
      if (!resp.ok) {
        throw new Error(`bruh it didnt work: ${resp.status}`);
      }

      const data = await resp.json();

      setData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //grab data on start
  useEffect(() => {
    fetchData();
  }, []);

  //load champ data
  useEffect(() => {
    console.log(data);

    let temp = {};

    for (var key in data) {
      temp[data[key]["name"]] = data[key]["key"];
    }

    //alphabetize the list so that its
    //the same like in the league client
    const alphabetized = Object.keys(temp)
      .sort()
      .reduce((obj, key) => {
        obj[key] = temp[key];
        return obj;
      }, {});

    setChamps(alphabetized);
  }, [data]);

  const Team = ({ team }) => {
    const side = team === "blue" ? state.blueChamps : state.redChamps;
    return (
      <section className={`team ${team}-side`}>
        {side.map((pick) => {
          //these champs are IN each teams picks, so picked is true by default.
          return <Champ champ={pick} id={pick ? champs[pick] : ""} />;
        })}
      </section>
    );
  };

  return (
    <main className="app">
      <Team team={"blue"} />
      <section className="champ-select">
        {champs
          ? Object.keys(champs).map((champ) => {
              const picked =
                state.blueChamps.includes(champ) ||
                state.redChamps.includes(champ);
              const dimStyle = picked ? { opacity: "0.2" } : { opacity: "1" };
              return (
                <>
                  <Champ champ={champ} id={champs[champ]} dimStyle={dimStyle} />
                </>
              );
            })
          : "loading..."}
      </section>
      <Team team={"red"} />
      <Sidebar>
        <Minimap />
      </Sidebar>
    </main>
  );
}

export default App;
