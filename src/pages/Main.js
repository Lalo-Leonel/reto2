import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Main.module.css";
export default function Main() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [showPage, setShowPage] = useState(10);

  function disponible(air_date, created) {
    const air = new Date(air_date);
    const creat = new Date(created);
    let resta = air.getTime() - creat.getTime();
    return Math.round(resta / (1000 * 60 * 60 * 24));
  }

  useEffect(() => {
    axios({
      method: "get",
      url: "https://rickandmortyapi.com/api/episode",
    }).then((response) => {
      setData(response.data.results);
    });
  }, []);
  const filteredData = () => {
    if (search.length === 0)
      return data.slice(currentPage, currentPage + showPage);
    const filtered = data.filter((item) => {
      const availableTime = disponible(item.air_date, item.created);
      return availableTime.toString().includes(search);
    });
    return filtered.slice(currentPage, currentPage + showPage);
  };
  const nextPage = () => {
    setCurrentPage(currentPage + showPage);
  };
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - showPage);
    }
  };
  
  const handleChangeSelect = (event) => {
    setShowPage(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.main}>Lista de Rick and Morty</h4>
      <div className={styles.accion}>
        <div>
          <select
            onChange={(event) => handleChangeSelect(event)}
            className={styles.select}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          ></input>
          <label className={styles.label}>Search</label>
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <table className="table table-bordered">
            <thead className={styles.thead}>
              <tr>
                <th className={styles.columName}>Name</th>
                <th className={styles.columEpisode}>Episode</th>
                <th className={styles.columDate}>Air_Date</th>
                <th className={styles.columDate}>Created</th>
                <th className={styles.columTime}>Tiempo Disponible</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {filteredData().map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.episode}</td>
                  <td>{item.air_date}</td>
                  <td>{item.created}</td>
                  <td>{disponible(item.air_date, item.created)} dias</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.paginacion}>
        <div>
          <button onClick={prevPage}>anterior</button>
        </div>
        <div>
          <button onClick={nextPage}>siguiente</button>
        </div>
      </div>
    </div>
  );
}
