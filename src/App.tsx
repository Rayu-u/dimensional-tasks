import React from "react";
import logo from "./logo.svg";
import "./App.css";
import TextualTask from "./components/textual-task-editor/TextualTask";
import TabHandler from "./components/tabStructure/tabHandler";
import Display from "./components/visual-editor/components/display/display";
import VisualEditor from "./components/visual-editor/visualEditor";
import { TaskContextProvider } from "./components/TaskContext";
import MappingAgent from "./components/mapping/MappingAgent";
import { PersistentContextProvider } from "./components/persistentContext";
const tabs = [
  {
    title: "Frageneditor",
    content: <TextualTask></TextualTask>,
  },
  {
    title: "Szeneneditor",
    content: (
      <div>
        <VisualEditor></VisualEditor>
      </div>
    ),
  },
  {
    title: "Mapping",
    content: <MappingAgent></MappingAgent>,
  },
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <TextualTask></TextualTask> */}
        <TaskContextProvider>
          <PersistentContextProvider>
            <TabHandler tabs={tabs}></TabHandler>
          </PersistentContextProvider>
        </TaskContextProvider>
      </header>
      <p>
        Editor für E-Learning Webkomponente mit dreidimensioneller interaktiver
        Darstellung (Bachelorthesis an der Hochschule Furtwangen. ) @Laura
        Fabricius, 2024.
      </p>
    </div>
  );
}

export default App;
