import { useEffect, useState } from "react";
import "./LocationSearch.css";
import { fetchMissions, type MissionRow } from "@/utils/missions";

export default function LocationSearch() {
  const [search, setSearch] = useState("");
  const [missions, setMissions] = useState<MissionRow[]>([]);

  useEffect(() => {
    fetchMissions().then((missions) => {
      // const activeMissions = missions.filter(
      //   (m) => m["Currently Accepting Packages"] == "TRUE",
      // );
      setMissions(missions);
    });
  }, []);

  const filteredMissions =
    search.trim() == ""
      ? missions.slice(0, 10)
      : missions
          .filter((m) => m["Mission Name"].toLowerCase().includes(search))
          .slice(0, 10);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for missions"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <table id="location-search-results">
        <thead>
          <tr>
            <th>Accepting Packages</th>
            <th>Mission</th>
            <th>Departure Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredMissions.map((mission) => (
            <tr className="filtered-mission" key={mission["Mission Name"]}>
              <td>
                {mission["Currently Accepting Packages"] == "TRUE"
                  ? "Yes"
                  : "No"}
              </td>
              <td>{mission["Mission Name"]}</td>
              <td>Not yet scheduled</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

{
  /* <style></style>

<script>
  import { fetchMissions } from "@/utils/missions";

  const $locationSearch = document.getElementById("location-search");
  const $locationSearchResults = document.getElementById(
    "location-search-results",
  );

  const missions = await fetchMissions();
  const missionsSending = missions.filter(
    (m) => m["Currently Accepting Packages"] == "TRUE",
  );
  console.log(missionsSending);
</script> */
}
