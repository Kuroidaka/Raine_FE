// ParentComponent.js

const ChildComponent = ({ message }) => {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

const ParentComponent = () => {
  return (
    <div>
      <h1>Đây là Parent Component</h1>
      <ChildComponent message="Xin chào từ Parent Component!" />
    </div>
  );
};

// App.js
import React from "react";
import ParentComponent from "./components/ParentComponent";

const App = () => {
  return (
    <div>
      <ParentComponent />
    </div>
  );
};

export default App;
