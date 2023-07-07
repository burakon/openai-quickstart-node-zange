import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {

  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      let str = data.result.replace("#出力文の例:", "");
      //もし最初に#出力文の例:があれば削除する

      setResult(str + "あなたに神のご加護があらんことを");
      // setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/kirisuto.png" />
      </Head>

      <main className={styles.main}>
        <img src="/kirisuto.png" className={styles.icon} />
        <h3>懺悔の部屋</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="懺悔をしてください"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="懺悔する" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
