import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import MenuPro from "./pages/MenuPro";
function App() {
   
  return (
    <Provider store={store}>
      <BrowserRouter>
        
          <Routes>
           <Route path="/menu/:slug" element={<MenuPro />} />
           <Route path="*" element={<MenuPro />} />
          </Routes>

      
      </BrowserRouter>
    </Provider>
  );
}

export default App;