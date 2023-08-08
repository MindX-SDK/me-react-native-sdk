import react, { useEffect } from "react";
import {MindExpressionApi} from 'me-react-native-sdk';
import { ENGINE_URL, AUTH_KEY } from "@/constants/AppConstants";

const mindExpressionAPI = new MindExpressionApi(
  ENGINE_URL,
  AUTH_KEY,
)
function App() {
  useEffect(() => {
    if (mindExpressionAPI) {
      mindExpressionAPI.greeting();
    }
  }, [mindExpressionAPI])
  return (
    <div className="App">
      <h1>Mind AI Expression test - phungnlg</h1>
    </div>
  );
}

export default App;